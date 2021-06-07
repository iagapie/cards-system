<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\RequestHandler;

use CategoryService\Api\Infrastructure\Exception\HttpNotFoundException;
use IA\Route\Resolver\Result;
use IA\Route\RouteInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use ReflectionMethod;
use ReflectionNamedType;

use function array_key_exists;
use function array_map;
use function explode;

final class DefaultHandler implements RequestHandlerInterface
{
    /**
     * DefaultHandler constructor.
     * @param ContainerInterface $container
     */
    public function __construct(private ContainerInterface $container)
    {
    }

    /**
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        /** @var RouteInterface $route */
        $route = $request->getAttribute(RouteInterface::class);

        $chain = new MiddlewareChainHandler(
            new class($this->container) implements RequestHandlerInterface {
                public function __construct(private ContainerInterface $container)
                {
                }

                public function handle(ServerRequestInterface $request): ResponseInterface
                {
                    /** @var RouteInterface $route */
                    $route = $request->getAttribute(RouteInterface::class);

                    [$serviceId, $method] = explode('::', $route->getHandler());

                    if (!$this->container->has($serviceId)) {
                        throw new HttpNotFoundException();
                    }

                    $reflectionMethod = new ReflectionMethod($serviceId, $method);

                    /** @var Result $result */
                    $result = $request->getAttribute(Result::class);

                    $routeArgs = $result->getArguments();
                    $arguments = [];

                    foreach ($reflectionMethod->getParameters() as $parameter) {
                        $name = $parameter->getName();

                        $refs[$name] = $parameter;

                        if (array_key_exists($name, $routeArgs)) {
                            $arguments[$name] = $routeArgs[$name];
                            continue;
                        }

                        if ($parameter->hasType() && $parameter->getType() instanceof ReflectionNamedType) {
                            $typeName = $parameter->getType()->getName();

                            if (is_a($typeName, ServerRequestInterface::class, true)) {
                                $arguments[$name] = $request;
                                continue;
                            }

                            if ($this->container->has($typeName)) {
                                $arguments[$name] = $this->container->get($typeName);
                                continue;
                            }
                        }

                        $arguments[$name] = null;
                    }

                    $service = $this->container->get($serviceId);

                    return $reflectionMethod->invokeArgs($service, $arguments);
                }
            },
            array_map(fn($item) => $this->container->get($item), $route->getMiddlewares())
        );

        return $chain->handle($request);
    }
}