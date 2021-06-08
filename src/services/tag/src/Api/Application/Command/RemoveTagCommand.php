<?php

declare(strict_types=1);

namespace TagService\Api\Application\Command;

use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Uuid;

final class RemoveTagCommand
{
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $id;

    /**
     * RemoveTagCommand constructor.
     * @param string $id
     */
    public function __construct(string $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }
}