<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use CategoryService\Domain\Exception\RecordNotFoundException;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use JsonSerializable;

use function array_filter;
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
            SELECT c.*, GROUP_CONCAT(p.permission SEPARATOR \' \') as permissions
            FROM '.self::CATEGORIES.' c
            LEFT JOIN '.self::PERMISSIONS.' p ON p.category_id = c.id
            WHERE c.id = :id
            GROUP BY c.id
            LIMIT 1
        ';

        if ($row = $this->connection->fetchAssociative($sql, ['id' => $id])) {
            return new class($row) implements JsonSerializable {
                public function __construct(private array $row)
                {
                }

                public function jsonSerialize()
                {
                    $ca = new DateTimeImmutable($this->row['created_at']);
                    $ua = new DateTimeImmutable($this->row['updated_at']);

                    $permissions = explode(' ', $this->row['permissions'] ?? '');
                    $permissions = array_filter($permissions);

                    return [
                        'id' => $this->row['id'],
                        'parentId' => $this->row['parent_id'] ?: null,
                        'boardId' => $this->row['board_id'],
                        'createdBy' => $this->row['created_by'],
                        'name' => $this->row['name'],
                        'description' => $this->row['description'] ?: null,
                        'position' => (int)$this->row['position'],
                        'createdAt' => $ca->format('c'),
                        'updatedAt' => $ua->format('c'),
                        'permissions' => $permissions,
                    ];
                }
            };
        }

        throw new RecordNotFoundException();
    }

    /**
     * {@inheritDoc}
     */
    public function getCategories(int $skip, int $limit): JsonSerializable
    {
        return new class implements JsonSerializable {
            public function jsonSerialize()
            {
                return [];
            }
        };
    }
}