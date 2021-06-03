<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Mapper;

use CategoryService\Domain\AggregateModel\CategoryAggregate\Category;

interface CategoryMapperInterface
{
    /**
     * @param array $row
     * @return Category
     */
    public function map(array $row): Category;
}