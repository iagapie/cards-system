<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\Category;
use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use CategoryService\Domain\Exception\RecordConflictException;
use Psr\Log\LoggerInterface;

final class CreateCategoryCommandHandler
{
    /**
     * CreateCategoryHandler constructor.
     * @param CategoryRepositoryInterface $categoryRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * @param CreateCategoryCommand $command
     * @throws RecordConflictException
     */
    public function handle(CreateCategoryCommand $command): void
    {
        $category = new Category(
            $command->getId(),
            $command->getParentId(),
            $command->getBoardId(),
            $command->getCreatedBy(),
            $command->getName(),
            $command->getDescription(),
            $command->getPosition()
        );

        $this->logger->info('----- Creating category: {id} - {parentId}', [
            'id' => $category->getId(),
            'parentId' => $category->getParentId(),
        ]);

        $this->categoryRepository->create($category);
    }
}