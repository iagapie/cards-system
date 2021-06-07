<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemoveCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordNotFoundException;
use Psr\Log\LoggerInterface;

final class RemoveCategoryHandler
{
    /**
     * RemoveCategoryHandler constructor.
     * @param CategoryRepositoryInterface $categoryRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * @param RemoveCategoryCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(RemoveCategoryCommand $command): void
    {
        $category = $this->categoryRepository->get($command->getId());

        $this->logger->info('----- Removing category: {id} - {parentId}', [
            'id' => $category->getId(),
            'parentId' => $category->getParentId(),
        ]);

        $this->categoryRepository->remove($category);
    }
}