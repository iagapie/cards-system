<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Uuid;

final class CreateTagCommand
{
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $boardId;

    #[NotBlank, Length(max: 100)]
    private string $name;

    #[NotBlank, Length(max: 100)]
    private string $color;

    /**
     * CreateTagCommand constructor.
     * @param string $id
     * @param string $boardId
     * @param string $name
     * @param string $color
     */
    public function __construct(string $id, string $boardId, string $name, string $color)
    {
        $this->id = $id;
        $this->boardId = $boardId;
        $this->name = $name;
        $this->color = $color;
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
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }
}