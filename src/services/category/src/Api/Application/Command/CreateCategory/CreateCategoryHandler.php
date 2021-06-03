<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use Psr\Log\LoggerInterface;

final class CreateCategoryHandler implements CreateCategoryHandlerInterface
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
     * {@inheritDoc}
     */
    public function handle(CreateCategoryCommand $command): void
    {
        // TODO: Implement handle() method.
    }
}