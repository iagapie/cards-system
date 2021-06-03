<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Mapper;

use CategoryService\Domain\AggregateModel\CategoryAggregate\Category;

use function explode;

final class CategoryMapper implements CategoryMapperInterface
{
    /**
     * {@inheritDoc}
     */
    public function map(array $row): Category
    {
        $category = new Category(
            $row['id'],
            $row['parent_id'] ?: null,
            $row['board_id'],
            $row['created_by'],
            $row['name'],
            $row['description'] ?: null,
            (int)$row['position']
        );

        foreach (explode(' ', $row['permissions'] ?? '') as $permission) {
            $category->addPermission($permission);
        }

        return $category;
    }
}