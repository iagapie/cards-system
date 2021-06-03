<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemoveCategory;

use CategoryService\Domain\AggregateModel\CategoryAggregate\CategoryRepositoryInterface;
use Psr\Log\LoggerInterface;

final class RemoveCategoryHandler implements RemoveCategoryHandlerInterface
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
     * {@inheritDoc}
     */
    public function handle(RemoveCategoryCommand $command): void
    {
        // TODO: Implement handle() method.
    }
}