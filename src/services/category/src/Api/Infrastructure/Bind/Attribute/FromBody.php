<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\BodyResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
final class FromBody extends Bind
{
    /**
     * Body constructor.
     * @param string|null $name
     */
    public function __construct(?string $name = null)
    {
        parent::__construct(BodyResolver::class, $name);
    }
}