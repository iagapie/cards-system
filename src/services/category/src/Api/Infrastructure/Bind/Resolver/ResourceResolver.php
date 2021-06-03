<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use CategoryService\Api\Infrastructure\Bind\Exception\InvalidResourceException;
use Psr\Http\Message\ServerRequestInterface;
use ReflectionClass;
use ReflectionException;

use Throwable;

use function array_key_exists;

final class ResourceResolver implements Resolver
{
    /**
     * ResourceResolver constructor.
     * @param ReflectionResolver $reflectionHelper
     */
    public function __construct(private ReflectionResolver $reflectionHelper)
    {
    }

    /**
     * @param string $name
     * @param ServerRequestInterface $request
     * @return mixed
     * @throws ReflectionException
     */
    public function resolve(string $name, ServerRequestInterface $request): mixed
    {
        try {
            $reflectionClass = new ReflectionClass($name);
        } catch (Throwable $e) {
            throw new InvalidResourceException($name, $e);
        }

        if (!$reflectionClass->isInstantiable()) {
            throw new InvalidResourceException($name);
        }

        $properties = [];

        foreach ($reflectionClass->getProperties() as $property) {
            if (null !== ($value = $this->reflectionHelper->resolveByReflection($property, $request))) {
                $properties[$property->getName()] = [$property, $value];
            }
        }

        $constructor = $reflectionClass->getConstructor();
        $parameters = [];

        foreach ($constructor->getParameters() as $parameter) {
            $name = $parameter->getName();

            if (array_key_exists($name, $properties)) {
                $parameters[$name] = $properties[$name][1];
                unset($properties[$name]);
            } else {
                $parameters[$parameter->getName()] = $this->reflectionHelper->resolveByReflection($parameter, $request);
            }
        }

        $instance = $reflectionClass->newInstanceArgs($parameters);

        foreach ($properties as [$property, $value]) {
            $property->setAccessible(true);
            $property->setValue($instance, $value);
        }

        return $instance;
    }
}