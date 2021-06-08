<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Psr\Log\LoggerInterface;
use TagService\Domain\AggregateModel\TagAggregate\Tag;
use TagService\Domain\AggregateModel\TagAggregate\TagRepositoryInterface;
use TagService\Domain\Exception\RecordConflictException;

final class CreateTagCommandHandler
{
    /**
     * CreateTagCommandHandler constructor.
     * @param TagRepositoryInterface $tagRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * @param CreateTagCommand $command
     * @throws RecordConflictException
     */
    public function handle(CreateTagCommand $command): void
    {
        $tag = new Tag($command->getId(), $command->getBoardId(), $command->getName(), $command->getColor());

        $this->logger->info('----- Creating tag: {id} - {name}', [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
        ]);

        $this->tagRepository->create($tag);
    }
}