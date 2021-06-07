<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Query;

use Symfony\Component\Validator\Constraints\LessThanOrEqual;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\PositiveOrZero;
use Symfony\Component\Validator\Constraints\Uuid;

final class Filter
{
    private array $id;

    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $parentId;

    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $boardId;

    #[PositiveOrZero]
    private int $skip;

    #[Positive, LessThanOrEqual(50)]
    private int $limit;

    public function __construct(array $id = [], ?string $parentId = null, ?string $boardId = null, int $skip = 0, int $limit = 50)
    {
        $this->id = $id;
        $this->parentId = $parentId;
        $this->boardId = $boardId;
        $this->skip = $skip;
        $this->limit = $limit;
    }

    /**
     * @return array
     */
    public function getId(): array
    {
        return $this->id;
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

    /**
     * @return int
     */
    public function getSkip(): int
    {
        return $this->skip;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }
}