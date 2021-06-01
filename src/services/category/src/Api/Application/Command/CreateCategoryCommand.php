<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command;

use Symfony\Component\Validator\Constraints\NotBlank;

final class CreateCategoryCommand
{
    #[NotBlank]
    private string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}