<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\RouteParamResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
final class FromRoute extends Bind
{
    /**
     * RouteParam constructor.
     * @param string|null $name
     */
    public function __construct(?string $name = null)
    {
        parent::__construct(RouteParamResolver::class, $name);
    }
}