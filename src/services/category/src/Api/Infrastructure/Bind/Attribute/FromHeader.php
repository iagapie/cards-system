<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\HeaderResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
final class FromHeader extends Bind
{
    /**
     * Header constructor.
     * @param string|null $name
     */
    public function __construct(?string $name = null)
    {
        parent::__construct(HeaderResolver::class, $name);
    }
}