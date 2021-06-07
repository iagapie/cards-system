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
     * @param Criteria $criteria
     * @param Range $range
     * @return JsonSerializable
     */
    public function getCategories(Criteria $criteria, Range $range): JsonSerializable;
}