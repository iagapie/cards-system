<?php

declare(strict_types=1);

namespace TagService\Api\Application\Query;

use JsonSerializable;
use TagService\Domain\Exception\RecordNotFoundException;

interface TagQueryInterface
{
    /**
     * @param string $id
     * @return JsonSerializable
     * @throws RecordNotFoundException
     */
    public function getTag(string $id): JsonSerializable;

    /**
     * @param Criteria $criteria
     * @param Range $range
     * @return JsonSerializable
     */
    public function getTags(Criteria $criteria, Range $range): JsonSerializable;
}