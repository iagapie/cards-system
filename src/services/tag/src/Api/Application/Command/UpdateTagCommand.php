<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Uuid;

final class UpdateTagCommand
{
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    #[NotBlank, Length(max: 100)]
    private string $name;

    #[NotBlank, Length(max: 100)]
    private string $color;

    /**
     * UpdateTagCommand constructor.
     * @param string $id
     * @param string $name
     * @param string $color
     */
    public function __construct(string $id, string $name, string $color)
    {
        $this->id = $id;
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