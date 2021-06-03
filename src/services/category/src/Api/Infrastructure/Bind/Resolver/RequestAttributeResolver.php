<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use Psr\Http\Message\ServerRequestInterface;

final class RequestAttributeResolver implements Resolver
{
    /**
     * {@inheritDoc}
     */
    public function resolve(string $name, ServerRequestInterface $request): mixed
    {
        return $request->getAttribute($name);
    }
}