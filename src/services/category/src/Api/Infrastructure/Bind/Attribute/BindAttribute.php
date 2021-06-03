<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

interface BindAttribute
{
    /**
     * @return string
     */
    public function getType(): string;
}