<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\UpdateCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordNotFoundException;
use Psr\Log\LoggerInterface;

final class UpdateCategoryHandler
{
    /**
     * UpdateCategoryHandler constructor.
     * @param CategoryRepositoryInterface $categoryRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * @param UpdateCategoryCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(UpdateCategoryCommand $command): void
    {
        $category = $this->categoryRepository->get($command->getId());

        $category->setParentId($command->getParentId());
        $category->setName($command->getName());
        $category->setDescription($command->getDescription());
        $category->setPosition($command->getPosition());

        $this->logger->info('----- Updating category: {id} - {parentId}', [
            'id' => $category->getId(),
            'parentId' => $category->getParentId(),
        ]);

        $this->categoryRepository->update($category);
    }
}