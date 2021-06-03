<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use Psr\Http\Message\ServerRequestInterface;

interface Resolver
{
    /**
     * @param string $name
     * @param ServerRequestInterface $request
     * @return mixed
     */
    public function resolve(string $name, ServerRequestInterface $request): mixed;
}