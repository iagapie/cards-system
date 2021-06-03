<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Repository;

use CategoryService\Domain\AggregateModel\CategoryAggregate\Category;
use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;
use CategoryService\Infrastructure\Mapper\CategoryMapperInterface;
use Doctrine\DBAL\Connection;

final class CategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private Connection $connection, private CategoryMapperInterface $categoryMapper)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $id): Category
    {
        // TODO: Implement get() method.
    }

    /**
     * {@inheritDoc}
     */
    public function create(Category $category): void
    {
        // TODO: Implement create() method.
    }

    /**
     * {@inheritDoc}
     */
    public function update(Category $category): void
    {
        // TODO: Implement update() method.
    }

    /**
     * {@inheritDoc}
     */
    public function remove(Category $category): void
    {
        // TODO: Implement remove() method.
    }
}