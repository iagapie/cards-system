<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\ResourceResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
class BindResource implements BindAttribute
{
    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return ResourceResolver::class;
    }
}