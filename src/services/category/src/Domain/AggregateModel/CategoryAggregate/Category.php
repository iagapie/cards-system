<?php

declare(strict_types=1);

namespace CategoryService\Domain\AggregateModel\CategoryAggregate;

use CategoryService\Domain\Exception\RecordConflictException;

use CategoryService\Domain\Exception\RecordNotFoundException;

use function array_key_exists;
use function array_keys;
use function sprintf;

final class Category
{
    /**
     * @var array<string, bool>
     */
    private array $permissions = [];

    public function __construct(
        private string $id,
        private ?string $parentId,
        private string $boardId,
        private string $createdBy,
        private string $name,
        private ?string $description,
        private int $position = 0
    ) {
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
    public function getCreatedBy(): string
    {
        return $this->createdBy;
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
     * @return string[]
     */
    public function getPermissions(): array
    {
        return array_keys($this->permissions);
    }

    /**
     * @param string|null $parentId
     */
    public function setParentId(?string $parentId): void
    {
        $this->parentId = $parentId;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @param string|null $description
     */
    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    /**
     * @param int $position
     */
    public function setPosition(int $position): void
    {
        $this->position = $position;
    }

    /**
     * @param string $permission
     * @throws RecordConflictException
     */
    public function addPermission(string $permission): void
    {
        if (array_key_exists($permission, $this->permissions)) {
            throw new RecordConflictException(
                sprintf('Unique constraint violation: %s - %s.', $this->id, $permission)
            );
        }

        $this->permissions[$permission] = true;
    }

    /**
     * @param string $permission
     * @throws RecordNotFoundException
     */
    public function removePermission(string $permission): void
    {
        if (!array_key_exists($permission, $this->permissions)) {
            throw new RecordNotFoundException(
                sprintf('Permission "%s" for "%s" not found.', $permission, $this->id)
            );
        }
        unset($this->permissions[$permission]);
    }
}