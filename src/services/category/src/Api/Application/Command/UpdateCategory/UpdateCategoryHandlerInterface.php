<?php

namespace CategoryService\Api\Application\Command\UpdateCategory;

interface UpdateCategoryHandlerInterface
{
    /**
     * @param UpdateCategoryCommand $command
     */
    public function handle(UpdateCategoryCommand $command): void;
}