<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\RequestAttributeResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
final class FromRequestAttribute extends Bind
{
    /**
     * RequestAttribute constructor.
     * @param string|null $name
     */
    public function __construct(?string $name = null)
    {
        parent::__construct(RequestAttributeResolver::class, $name);
    }
}