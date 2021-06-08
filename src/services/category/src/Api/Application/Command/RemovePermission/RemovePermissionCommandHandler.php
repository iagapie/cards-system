<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemovePermission;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordNotFoundException;
use Psr\Log\LoggerInterface;

final class RemovePermissionCommandHandler
{
    /**
     * RemovePermissionHandler constructor.
     * @param CategoryRepositoryInterface $categoryRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * @param RemovePermissionCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(RemovePermissionCommand $command): void
    {
        $category = $this->categoryRepository->get($command->getCategoryId());

        $category->removePermission($command->getPermission());

        $this->logger->info('----- Removing category permission: {categoryId} - {permission}', [
            'categoryId' => $category->getId(),
            'permission' => $command->getPermission(),
        ]);

        $this->categoryRepository->update($category);
    }
}