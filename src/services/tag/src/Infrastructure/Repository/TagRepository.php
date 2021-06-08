<?php

declare(strict_types=1);

namespace TagService\Infrastructure\Repository;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use TagService\Domain\AggregateModel\TagAggregate\Tag;
use TagService\Domain\AggregateModel\TagAggregate\TagRepositoryInterface;
use TagService\Domain\Exception\RecordConflictException;
use TagService\Domain\Exception\RecordNotFoundException;

use function sprintf;

final class TagRepository implements TagRepositoryInterface
{
    private const TAGS = 'tags';

    /**
     * TagRepository constructor.
     * @param Connection $connection
     */
    public function __construct(private Connection $connection)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $id): Tag
    {
        $row = $this->connection->createQueryBuilder()
            ->select('*')
            ->from(self::TAGS)
            ->where('id = ?')
            ->setParameter(0, $id)
            ->setMaxResults(1)
            ->fetchAssociative();

        if (!$row) {
            throw $this->notFound($id);
        }

        return new Tag($row['id'], $row['board_id'], $row['name'], $row['color']);
    }

    /**
     * {@inheritDoc}
     */
    public function create(Tag $tag): void
    {
        $params = [
            $tag->getId(),
            $tag->getBoardId(),
            $tag->getName(),
            $tag->getColor(),
        ];

        $qb = $this->connection->createQueryBuilder()
            ->insert(self::TAGS)
            ->setValue('id', '?')
            ->setValue('board_id', '?')
            ->setValue('name', '?')
            ->setValue('color', '?')
            ->setParameters($params);

        try {
            $qb->executeStatement();
        } catch (UniqueConstraintViolationException $e) {
            throw new RecordConflictException(
                sprintf('Tag unique constraint violation: %s', $tag->getId()),
                previous: $e
            );
        }
    }

    /**
     * {@inheritDoc}
     */
    public function update(Tag $tag): void
    {
        $params = [
            $tag->getName(),
            $tag->getColor(),
            $tag->getId(),
        ];

        $this->connection->createQueryBuilder()
            ->update(self::TAGS)
            ->set('name', '?')
            ->set('color', '?')
            ->where('id = ?')
            ->setParameters($params)
            ->executeStatement();
    }

    /**
     * {@inheritDoc}
     */
    public function remove(Tag $tag): void
    {
        if ($this->connection->delete(self::TAGS, ['id' => $tag->getId()]) < 1) {
            throw $this->notFound($tag->getId());
        }
    }

    /**
     * @param string $id
     * @return RecordNotFoundException
     */
    private function notFound(string $id): RecordNotFoundException
    {
        return new RecordNotFoundException(sprintf('Tag "%s" not found', $id));
    }
}