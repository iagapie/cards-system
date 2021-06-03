<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
abstract class Bind implements BindAttribute
{
    /**
     * Bind constructor.
     * @param string $type
     * @param string|null $name
     */
    public function __construct(private string $type, public ?string $name = null)
    {
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }
}