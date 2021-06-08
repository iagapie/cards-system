<?php

declare(strict_types=1);

namespace TagService\Api\Application\Query;

final class Criteria
{
    /**
     * @var string[]
     */
    private array $ids;

    /**
     * @var string|null
     */
    private ?string $boardId;

    /**
     * Criteria constructor.
     * @param string[] $ids
     * @param string|null $boardId
     */
    public function __construct(array $ids, ?string $boardId)
    {
        $this->ids = $ids;
        $this->boardId = $boardId;
    }

    /**
     * @return string[]
     */
    public function getIds(): array
    {
        return $this->ids;
    }

    /**
     * @return string|null
     */
    public function getBoardId(): ?string
    {
        return $this->boardId;
    }
}