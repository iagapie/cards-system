<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use Doctrine\DBAL\Connection;

final class CategoryQuery implements CategoryQueryInterface
{
    /**
     * CategoryQuery constructor.
     * @param Connection $connection
     */
    public function __construct(private Connection $connection)
    {
    }
}