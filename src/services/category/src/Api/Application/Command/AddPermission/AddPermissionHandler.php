<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\AddPermission;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use Psr\Log\LoggerInterface;

final class AddPermissionHandler implements AddPermissionHandlerInterface
{
    /**
     * AddPermissionHandler constructor.
     * @param CategoryRepositoryInterface $categoryRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function handle(AddPermissionCommand $command): void
    {
        $category = $this->categoryRepository->get($command->getCategoryId());
        $this->logger->debug(__METHOD__ . ' -- ' . count($category->getPermissions()));
        $category->addPermission($command->getPermission());

        $this->logger->info('----- Adding category permission: {categoryId} - {permission}', [
            'categoryId' => $category->getId(),
            'permission' => $command->getPermission(),
        ]);
        $this->logger->debug(__METHOD__ . ' -- ' . count($category->getPermissions()));
        $this->categoryRepository->update($category);
    }
}