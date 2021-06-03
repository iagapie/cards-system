<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Repository;

use CategoryService\Domain\AggregateModel\CategoryAggregate\Category;
use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;
use CategoryService\Infrastructure\Mapper\CategoryMapperInterface;
use Doctrine\DBAL\Connection;

use Doctrine\DBAL\Exception;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

use function array_diff;
use function implode;
use function sprintf;

final class CategoryRepository implements CategoryRepositoryInterface
{
    public const CATEGORIES = 'categories';
    public const PERMISSIONS = 'permissions';

    public function __construct(private Connection $connection, private CategoryMapperInterface $categoryMapper)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $id): Category
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
            return $this->categoryMapper->map($row);
        }

        throw $this->notFound($id);
    }

    /**
     * {@inheritDoc}
     */
    public function create(Category $category): void
    {
        $data = [
            'id' => $category->getId(),
            'parent_id' => $category->getParentId() ?: null,
            'board_id' => $category->getBoardId(),
            'created_by' => $category->getCreatedBy(),
            'name' => $category->getName(),
            'description' => $category->getDescription() ?: null,
            'position' => $category->getPosition(),
        ];

        try {
            $this->connection->insert(self::CATEGORIES, $data);
            $this->insertPermissions($category->getId(), $category->getPermissions());
        } catch (UniqueConstraintViolationException $e) {
            throw new RecordConflictException(
                sprintf('Category unique constraint violation: %s', $category->getId()),
                previous: $e
            );
        }
    }

    /**
     * {@inheritDoc}
     */
    public function update(Category $category): void
    {
        $data = [
            'parent_id' => $category->getParentId() ?: null,
            'name' => $category->getName(),
            'description' => $category->getDescription() ?: null,
            'position' => $category->getPosition(),
        ];

        $this->connection->update(self::CATEGORIES, $data, ['id' => $category->getId()]);

        $sql = 'DELETE FROM '.self::PERMISSIONS.' WHERE category_id = :id AND permission NOT IN (:perms)';
        $this->connection->executeStatement(
            $sql,
            ['id' => $category->getId(), 'perms' => $category->getPermissions()],
            ['perms' => Connection::PARAM_STR_ARRAY]
        );

        $permissions = $this->connection->fetchFirstColumn(
            'SELECT permission FROM '.self::PERMISSIONS.' WHERE category_id = ?',
            [$category->getId()]
        );

        $this->insertPermissions($category->getId(), array_diff($category->getPermissions(), $permissions));
    }

    /**
     * {@inheritDoc}
     */
    public function remove(Category $category): void
    {
        if ($this->connection->delete(self::CATEGORIES, ['id' => $category->getId()]) < 1) {
            throw $this->notFound($category->getId());
        }
    }

    /**
     * @param string $id
     * @return RecordNotFoundException
     */
    private function notFound(string $id): RecordNotFoundException
    {
        return new RecordNotFoundException(sprintf('Category "%s" not found', $id));
    }

    /**
     * @param string $id
     * @param array $permissions
     * @throws Exception
     */
    private function insertPermissions(string $id, array $permissions): void
    {
        $params = ['id' => $id];
        $values = [];

        foreach ($permissions as $i => $permission) {
            $params[sprintf('p%d', $i)] = $permission;
            $values[] = sprintf('(:id, :p%d)', $i);
        }

        if ($values = implode(',', $values)) {
            $sql = 'INSERT INTO '.self::PERMISSIONS.' (category_id, permission) VALUES '.$values;
            $this->connection->executeStatement($sql, $params);
        }
    }
}