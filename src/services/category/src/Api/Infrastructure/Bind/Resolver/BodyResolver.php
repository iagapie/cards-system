<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use Psr\Http\Message\ServerRequestInterface;

use function is_array;

final class BodyResolver implements Resolver
{
    /**
     * {@inheritDoc}
     */
    public function resolve(string $name, ServerRequestInterface $request): mixed
    {
        $parsed = $request->getParsedBody();

        return is_array($parsed) ? $parsed[$name] ?? null : null;
    }
}