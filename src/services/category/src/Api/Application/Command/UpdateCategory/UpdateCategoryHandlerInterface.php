<?php

namespace CategoryService\Api\Application\Command\UpdateCategory;

use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;

interface UpdateCategoryHandlerInterface
{
    /**
     * @param UpdateCategoryCommand $command
     * @throws RecordConflictException
     * @throws RecordNotFoundException
     */
    public function handle(UpdateCategoryCommand $command): void;
}