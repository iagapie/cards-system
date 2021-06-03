<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemoveCategory;

use CategoryService\Domain\Exception\RecordNotFoundException;

interface RemoveCategoryHandlerInterface
{
    /**
     * @param RemoveCategoryCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(RemoveCategoryCommand $command): void;
}