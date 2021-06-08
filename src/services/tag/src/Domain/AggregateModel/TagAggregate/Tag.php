<?php

declare(strict_types=1);

namespace TagService\Domain\AggregateModel\TagAggregate;

final class Tag
{
    /**
     * Tag constructor.
     * @param string $id
     * @param string $boardId
     * @param string $name
     * @param string $color
     */
    public function __construct(
        private string $id,
        private string $boardId,
        private string $name,
        private string $color,
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
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }

    /**
     * @param string $color
     */
    public function setColor(string $color): void
    {
        $this->color = $color;
    }
}