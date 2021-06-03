<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\RequestHandler;

use CategoryService\Api\Infrastructure\Bind\Resolver\ReflectionResolver;
use CategoryService\Api\Infrastructure\Exception\HttpNotFoundException;
use IA\Route\Resolver\Result;
use IA\Route\RouteInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use ReflectionException;
use ReflectionMethod;

use function array_key_exists;
use function array_map;
use function explode;

final class DefaultHandler implements RequestHandlerInterface
{
    public const ACTION_CONTEXT = 'ACTION_CONTEXT';

    /**
     * DefaultHandler constructor.
     * @param ContainerInterface $container
     * @param ReflectionResolver $reflectionHelper
     */
    public function __construct(private ContainerInterface $container, private ReflectionResolver $reflectionHelper)
    {
    }

    /**
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     * @throws ReflectionException
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        /** @var Result $result */
        $result = $request->getAttribute(Result::class);

        /** @var RouteInterface $route */
        $route = $request->getAttribute(RouteInterface::class);

        [$serviceId, $method] = explode('::', $route->getHandler());

        if (!$this->container->has($serviceId)) {
            throw new HttpNotFoundException();
        }

        $reflectionMethod = new ReflectionMethod($serviceId, $method);

        $routeArgs = $result->getArguments();
        $arguments = [];
        $refs = [];

        foreach ($reflectionMethod->getParameters() as $parameter) {
            $name = $parameter->getName();

            $refs[$name] = $parameter;

            if (array_key_exists($name, $routeArgs)) {
                $arguments[$name] = $routeArgs[$name];
                continue;
            }

            $arguments[$name] = $this->reflectionHelper->resolveByReflection($parameter, $request);
        }

        $ctx = new ActionContext(
            fn($args) => $reflectionMethod->invokeArgs($this->container->get($serviceId), $args),
            $refs,
            $arguments
        );

        $request = $request->withAttribute(self::ACTION_CONTEXT, $ctx);

        $chain = new MiddlewareChainHandler(
            new class implements RequestHandlerInterface {
                public function handle(ServerRequestInterface $request): ResponseInterface
                {
                    /** @var ActionContext $ctx */
                    $ctx = $request->getAttribute(DefaultHandler::ACTION_CONTEXT);

                    return $ctx->getAction()($ctx->getArguments());
                }
            },
            array_map(fn($item) => $this->container->get($item), $route->getMiddlewares())
        );

        return $chain->handle($request);
    }
}