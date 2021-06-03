<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Attribute;

use Attribute;
use CategoryService\Api\Infrastructure\Bind\Resolver\QueryResolver;

#[Attribute(Attribute::TARGET_PARAMETER | Attribute::TARGET_PROPERTY)]
final class FromQuery extends Bind
{
    /**
     * Query constructor.
     * @param string|null $name
     */
    public function __construct(?string $name = null)
    {
        parent::__construct(QueryResolver::class, $name);
    }
}