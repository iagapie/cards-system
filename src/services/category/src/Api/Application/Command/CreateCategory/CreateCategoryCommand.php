<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\CreateCategory;

use CategoryService\Api\Infrastructure\Bind\Attribute\FromBody;
use Ramsey\Uuid\Uuid as RUuid;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Range;
use Symfony\Component\Validator\Constraints\Uuid;

final class CreateCategoryCommand
{
    private string $id;

    #[FromBody]
    #[NotBlank, Length(max: 150)]
    private string $name;

    #[FromBody]
    #[Length(max: 1000)]
    private ?string $description;

    #[FromBody]
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $boardId;

    #[FromBody]
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $createdBy;

    #[FromBody]
    #[Range(min: -1000, max: 1000)]
    private int $position;

    #[FromBody]
    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $parentId;

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
        string $name,
        ?string $description,
        string $boardId,
        string $createdBy,
        int $position = 0,
        ?string $parentId = null,
        string $id = RUuid::NIL
    ) {
        $this->id = $id;

        $this->name = $name;
        $this->description = $description;
        $this->boardId = $boardId;
        $this->createdBy = $createdBy;
        $this->position = $position;
        $this->parentId = $parentId;
    }

    /**
     * @param string $id
     * @return self
     */
    public function withId(string $id): self
    {
        $clone = clone $this;
        $clone->id = $id;
        return $clone;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
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
    public function getBoardId(): string
    {
        return $this->boardId;
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

    /**
     * @return string|null
     */
    public function getParentId(): ?string
    {
        return $this->parentId;
    }
}