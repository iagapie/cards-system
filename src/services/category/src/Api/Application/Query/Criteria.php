<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

final class Criteria
{
    /**
     * @var string[]
     */
    private array $ids;

    /**
     * @var string|null
     */
    private ?string $parentId;

    /**
     * @var string|null
     */
    private ?string $boardId;

    /**
     * Criteria constructor.
     * @param string[] $ids
     * @param string|null $parentId
     * @param string|null $boardId
     */
    public function __construct(array $ids, ?string $parentId, ?string $boardId)
    {
        $this->ids = $ids;
        $this->parentId = $parentId;
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
    public function getParentId(): ?string
    {
        return $this->parentId;
    }

    /**
     * @return string|null
     */
    public function getBoardId(): ?string
    {
        return $this->boardId;
    }
}