<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

use CategoryService\Domain\Exception\RecordConflictException;

interface CreateCategoryHandlerInterface
{
    /**
     * @param CreateCategoryCommand $command
     * @throws RecordConflictException
     */
    public function handle(CreateCategoryCommand $command): void;
}