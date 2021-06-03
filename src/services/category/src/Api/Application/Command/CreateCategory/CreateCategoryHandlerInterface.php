<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

interface CreateCategoryHandlerInterface
{
    /**
     * @param CreateCategoryCommand $command
     */
    public function handle(CreateCategoryCommand $command): void;
}