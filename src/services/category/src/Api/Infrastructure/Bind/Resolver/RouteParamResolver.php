<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use IA\Route\Resolver\Result;
use Psr\Http\Message\ServerRequestInterface;

final class RouteParamResolver implements Resolver
{
    /**
     * {@inheritDoc}
     */
    public function resolve(string $name, ServerRequestInterface $request): mixed
    {
        /** @var Result $result */
        $result = $request->getAttribute(Result::class);

        return $result->getArguments()[$name] ?? null;
    }
}