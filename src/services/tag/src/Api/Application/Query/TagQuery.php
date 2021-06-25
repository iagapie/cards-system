<?php

declare(strict_types=1);

namespace TagService\Api\Application\Query;

use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use JsonSerializable;
use TagService\Domain\Exception\RecordNotFoundException;

final class TagQuery implements TagQueryInterface
{
    private const TAGS = 'tags';

    /**
     * TagQuery constructor.
     * @param Connection $connection
     */
    public function __construct(private Connection $connection)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getTag(string $id): JsonSerializable
    {
        $row = $this->connection->createQueryBuilder()
            ->select('*')
            ->from(self::TAGS)
            ->where('id = ?')
            ->setParameter(0, $id)
            ->setMaxResults(1)
            ->fetchAssociative();

        if (!$row) {
            throw new RecordNotFoundException();
        }

        $row = $this->normalize($row);

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
    public function getTags(Criteria $criteria, Range $range): JsonSerializable
    {
        $params = [];
        $types = [];

        $qb = $this->connection->createQueryBuilder()
            ->select('*')
            ->from(self::TAGS)
            ->where('1 = 1')
            ->orderBy('updated_at', 'DESC')
            ->setMaxResults($range->getLimit())
            ->setFirstResult($range->getSkip());

        if ($criteria->getIds()) {
            $qb->andWhere('id IN (?)');
            $params[] = $criteria->getIds();
            $types[0] = Connection::PARAM_STR_ARRAY;
        }

        if ($criteria->getBoardId()) {
            $qb->andWhere('board_id = ?');
            $params[] = $criteria->getBoardId();
        }

        $rows = $qb->setParameters($params, $types)->fetchAllAssociative();
        $rows = array_map(fn($row) => $this->normalize($row), $rows);

        return new class($rows) implements JsonSerializable {
            public function __construct(private array $rows)
            {
            }

            public function jsonSerialize(): array
            {
                return ['tags' => $this->rows];
            }
        };
    }

    /**
     * @param array $row
     * @return array
     */
    private function normalize(array $row): array
    {
        $ca = new DateTimeImmutable($row['created_at']);
        $ua = new DateTimeImmutable($row['updated_at']);

        return [
            'id' => $row['id'],
            'board_id' => $row['board_id'],
            'name' => $row['name'],
            'color' => $row['color'],
            'created_at' => $ca->format('c'),
            'updated_at' => $ua->format('c'),
        ];
    }
}