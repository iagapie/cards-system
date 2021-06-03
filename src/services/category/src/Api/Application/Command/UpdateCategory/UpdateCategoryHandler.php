<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\UpdateCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use Psr\Log\LoggerInterface;

final class UpdateCategoryHandler implements UpdateCategoryHandlerInterface
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
     * {@inheritDoc}
     */
    public function handle(UpdateCategoryCommand $command): void
    {
        // TODO: Implement handle() method.
    }
}