<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemoveCategory;

final class RemoveCategoryCommand
{
    private string $id;

    /**
     * RemoveCategoryCommand constructor.
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