<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemoveCategory;

interface RemoveCategoryHandlerInterface
{
    /**
     * @param RemoveCategoryCommand $command
     */
    public function handle(RemoveCategoryCommand $command): void;
}