<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\UpdateCategory;

use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Range;
use Symfony\Component\Validator\Constraints\Uuid;

final class UpdateCategoryCommand
{
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $parentId;

    #[NotBlank, Length(max: 150)]
    private string $name;

    #[Length(max: 1000)]
    private ?string $description;

    #[Range(min: -1000, max: 1000)]
    private int $position;

    /**
     * UpdateCategoryCommand constructor.
     * @param string $id
     * @param string|null $parentId
     * @param string $name
     * @param string|null $description
     * @param int $position
     */
    public function __construct(string $id, ?string $parentId, string $name, ?string $description, int $position)
    {
        $this->id = $id;
        $this->parentId = $parentId;
        $this->name = $name;
        $this->description = $description;
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
     * @return int
     */
    public function getPosition(): int
    {
        return $this->position;
    }
}