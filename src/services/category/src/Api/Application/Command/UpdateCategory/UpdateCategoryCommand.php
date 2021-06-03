<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\UpdateCategory;

use CategoryService\Api\Infrastructure\Bind\Attribute\FromBody;
use CategoryService\Api\Infrastructure\Bind\Attribute\FromRoute;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Range;
use Symfony\Component\Validator\Constraints\Uuid;

final class UpdateCategoryCommand
{
    #[FromRoute]
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    #[FromBody]
    #[NotBlank, Length(max: 150)]
    private string $name;

    #[FromBody]
    #[Length(max: 1000)]
    private ?string $description;

    #[FromBody]
    #[Range(min: -1000, max: 1000)]
    private int $position;

    #[FromBody]
    #[Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private ?string $parentId;

    /**
     * UpdateCategoryCommand constructor.
     * @param string $id
     * @param string $name
     * @param string|null $description
     * @param int $position
     * @param string|null $parentId
     */
    public function __construct(string $id, string $name, ?string $description, int $position, ?string $parentId)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->position = $position;
        $this->parentId = $parentId;
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