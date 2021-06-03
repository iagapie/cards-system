<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use CategoryService\Domain\Exception\RecordNotFoundException;
use JsonSerializable;

interface CategoryQueryInterface
{
    /**
     * @param string $id
     * @return JsonSerializable
     * @throws RecordNotFoundException
     */
    public function getCategory(string $id): JsonSerializable;

    /**
     * @param int $skip
     * @param int $limit
     * @return JsonSerializable
     */
    public function getCategories(int $skip, int $limit): JsonSerializable;
}