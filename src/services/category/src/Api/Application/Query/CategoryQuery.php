<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use CategoryService\Domain\Exception\RecordNotFoundException;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use JsonSerializable;

use function array_filter;
use function array_key_exists;
use function array_merge;
use function explode;

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
            SELECT
                c.id,
                c.parent_id,
                c.board_id,
                c.created_by,
                c.name,
                c.description,
                c.position,
                c.created_at,
                c.updated_at,
                GROUP_CONCAT(p.permission SEPARATOR \' \') as permissions
            FROM '.self::CATEGORIES.' c
            LEFT JOIN '.self::PERMISSIONS.' p ON p.category_id = c.id
            WHERE c.id = :id OR c.parentId = :id
            GROUP BY c.id
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
    public function getCategories(int $skip, int $limit): JsonSerializable
    {
        return new class implements JsonSerializable {
            public function jsonSerialize(): array
            {
                return [];
            }
        };
    }

    /**
     * @param array $row
     * @param array $append
     * @return array
     */
    private function normalize(array $row, array $append): array
    {
        $ca = new DateTimeImmutable($row['created_at']);
        $ua = new DateTimeImmutable($row['updated_at']);

        $permissions = explode(' ', $row['permissions'] ?? '');
        $permissions = array_filter($permissions);

        return array_merge(
            $row,
            [
                'parentId' => $row['parent_id'] ?: null,
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