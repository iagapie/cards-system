<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Range;
use Symfony\Component\Validator\Constraints\Uuid;

final class CreateCategoryCommand
{
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $parentId;

    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $boardId;

    #[NotBlank, Length(max: 150)]
    private string $name;

    #[Length(max: 1000)]
    private ?string $description;

    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $createdBy;

    #[Range(min: -1000, max: 1000)]
    private int $position;

    /**
     * CreateCategoryCommand constructor.
     * @param string $name
     * @param string|null $description
     * @param string $boardId
     * @param string $createdBy
     * @param int $position
     * @param string|null $parentId
     * @param string $id
     */
    public function __construct(
        string $id,
        ?string $parentId,
        string $boardId,
        string $name,
        ?string $description,
        string $createdBy,
        int $position,
    ) {
        $this->id = $id;
        $this->parentId = $parentId;
        $this->boardId = $boardId;
        $this->name = $name;
        $this->description = $description;
        $this->createdBy = $createdBy;
        $this->position = $position;
    }

    /**
     * @return string
     */
    public function getId(): string
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
     * @return string
     */
    public function getBoardId(): string
    {
        return $this->boardId;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @return string
     */
    public function getCreatedBy(): string
    {
        return $this->createdBy;
    }

    /**
     * @return int
     */
    public function getPosition(): int
    {
        return $this->position;
    }
}