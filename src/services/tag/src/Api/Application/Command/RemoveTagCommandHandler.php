<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Psr\Log\LoggerInterface;
use TagService\Domain\AggregateModel\TagAggregate\TagRepositoryInterface;
use TagService\Domain\Exception\RecordNotFoundException;

final class RemoveTagCommandHandler
{
    /**
     * RemoveTagCommandHandler constructor.
     * @param TagRepositoryInterface $tagRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * @param RemoveTagCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(RemoveTagCommand $command): void
    {
        $tag = $this->tagRepository->get($command->getId());

        $this->logger->info('----- Removing tag: {id} - {name}', [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
        ]);

        $this->tagRepository->remove($tag);
    }
}