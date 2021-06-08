<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Psr\Log\LoggerInterface;
use TagService\Domain\AggregateModel\TagAggregate\TagRepositoryInterface;
use TagService\Domain\Exception\RecordNotFoundException;

final class UpdateTagCommandHandler
{
    /**
     * UpdateTagCommandHandler constructor.
     * @param TagRepositoryInterface $tagRepository
     * @param LoggerInterface $logger
     */
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * @param UpdateTagCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(UpdateTagCommand $command): void
    {
        $tag = $this->tagRepository->get($command->getId());

        $tag->setName($command->getName());
        $tag->setColor($command->getColor());

        $this->logger->info('----- Updating tag: {id}', ['id' => $tag->getId()]);

        $this->tagRepository->update($tag);
    }
}