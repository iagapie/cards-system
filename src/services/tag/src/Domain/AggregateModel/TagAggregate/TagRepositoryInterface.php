<?php

declare(strict_types=1);

namespace TagService\Domain\AggregateModel\TagAggregate;

use TagService\Domain\Exception\RecordConflictException;
use TagService\Domain\Exception\RecordNotFoundException;

interface TagRepositoryInterface
{
    /**
     * @param string $id
     * @return Tag
     * @throws RecordNotFoundException
     */
    public function get(string $id): Tag;

    /**
     * @param Tag $tag
     * @throws RecordConflictException
     */
    public function create(Tag $tag): void;

    /**
     * @param Tag $tag
     */
    public function update(Tag $tag): void;

    /**
     * @param Tag $tag
     * @throws RecordNotFoundException
     */
    public function remove(Tag $tag): void;
}