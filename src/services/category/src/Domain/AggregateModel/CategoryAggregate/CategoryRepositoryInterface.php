<?php

declare(strict_types=1);

namespace CategoryService\Domain\AggregateModel\CategoryAggregate;

use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;

interface CategoryRepositoryInterface
{
    /**
     * @param string $id
     * @return Category
     * @throws RecordNotFoundException
     */
    public function get(string $id): Category;

    /**
     * @param Category $category
     * @throws RecordConflictException
     */
    public function create(Category $category): void;

    /**
     * @param Category $category
     * @throws RecordConflictException
     */
    public function update(Category $category): void;

    /**
     * @param Category $category
     * @throws RecordNotFoundException
     */
    public function remove(Category $category): void;
}