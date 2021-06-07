<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use CategoryService\Domain\Exception\RecordNotFoundException;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use JsonSerializable;

use function array_filter;
use function array_key_exists;
use function array_map;
use function array_merge;
use function explode;
use function strtoupper;

final class CategoryQuery implements CategoryQueryInterface
{
    private const CATEGORIES = 'categories';
    private const PERMISSIONS = 'permissions';

    /**
     * CategoryQuery constructor.
     * @param Connection $connection
     */
    public function __construct(private Connection $connection)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getCategory(string $id): JsonSerializable
    {
        $sql = '
            SELECT c.*, GROUP_CONCAT(p.permission SEPARATOR \' \') AS permissions
            FROM '.self::CATEGORIES.' c
            LEFT JOIN '.self::PERMISSIONS.' p ON p.category_id = c.id
            WHERE c.id = :id OR c.parent_id = :id
            GROUP BY c.id
            ORDER BY c.position ASC, c.updated_at DESC
        ';

        $rows = $this->connection->fetchAllAssociativeIndexed($sql, ['id' => $id]);

        if (count($rows) === 0 || !array_key_exists($id, $rows)) {
            throw new RecordNotFoundException();
        }

        $row = $this->normalize($rows[$id], ['id' => $id, 'children' => []]);

        unset($rows[$id]);

        foreach ($rows as $key => $value) {
            $row['children'][$key] = $this->normalize($value, ['id' => $key]);
        }

        return new class($row) implements JsonSerializable {
            public function __construct(private array $row)
            {
            }

            public function jsonSerialize(): array
            {
                return $this->row;
            }
        };
    }

    /**
     * {@inheritDoc}
     */
    public function getCategories(Criteria $criteria, Range $range): JsonSerializable
    {
        $params = [];
        $types = [];

        $qb = $this->connection->createQueryBuilder()
            ->select('c.*', 'GROUP_CONCAT(p.permission SEPARATOR \' \') AS permissions')
            ->from(self::CATEGORIES, 'c')
            ->leftJoin('c', self::PERMISSIONS, 'p', 'p.category_id = c.id')
            ->where('1 = 1')
            ->groupBy('c.id')
            ->orderBy('c.position', 'ASC')
            ->addOrderBy('c.updated_at', 'DESC')
            ->setMaxResults($range->getLimit())
            ->setFirstResult($range->getSkip());

        if ($criteria->getIds()) {
            $qb->andWhere('c.id IN (?)');
            $params[] = $criteria->getIds();
            $types[0] = Connection::PARAM_STR_ARRAY;
        }

        if ($criteria->getParentId()) {
            if ('NULL' === strtoupper($criteria->getParentId())) {
                $qb->andWhere('c.parent_id IS NULL');
            } else {
                $qb->andWhere('c.parent_id = ?');
                $params[] = $criteria->getParentId();
            }
        }

        if ($criteria->getBoardId()) {
            $qb->andWhere('c.board_id = ?');
            $params[] = $criteria->getBoardId();
        }

        $rows = $qb->setParameters($params, $types)->fetchAllAssociative();
        $rows = array_map(fn ($row) => $this->normalize($row), $rows);

        return new class($rows) implements JsonSerializable {
            public function __construct(private array $rows)
            {
            }

            public function jsonSerialize(): array
            {
                return ['categories' => $this->rows];
            }
        };
    }

    /**
     * @param array $row
     * @param array $append
     * @return array
     */
    private function normalize(array $row, array $append = []): array
    {
        $ca = new DateTimeImmutable($row['created_at']);
        $ua = new DateTimeImmutable($row['updated_at']);

        $permissions = explode(' ', $row['permissions'] ?? '');
        $permissions = array_filter($permissions);

        return array_merge(
            [
                'id' => $row['id'] ?? '',
                'parentId' => $row['parent_id'] ?: null,
                'boardId' => $row['board_id'],
                'createdBy' => $row['created_by'],
                'name' => $row['name'],
                'description' => $row['description'] ?: null,
                'position' => (int)$row['position'],
                'createdAt' => $ca->format('c'),
                'updatedAt' => $ua->format('c'),
                'permissions' => $permissions,
            ],
            $append
        );
    }
}