<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Resolver;

use ArrayObject;
use CategoryService\Api\Infrastructure\Bind\Attribute\Bind;
use CategoryService\Api\Infrastructure\Bind\Attribute\BindAttribute;
use CategoryService\Api\Infrastructure\Bind\Attribute\BindResource;
use CategoryService\Api\Infrastructure\Bind\Exception\InvalidResourceException;
use CategoryService\Api\Infrastructure\Bind\Exception\ResolverNotFound;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ServerRequestInterface;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionException;
use ReflectionNamedType;
use ReflectionParameter;
use ReflectionProperty;

use Traversable;

use function array_key_exists;
use function class_exists;
use function is_a;

class ReflectionResolver
{
    private array $defaultValues = [
        'int' => 0,
        'float' => 0.0,
        'string' => '',
        'bool' => false,
        'array' => [],
        'iterable' => [],
    ];

    public function __construct(private ContainerInterface $container)
    {
    }

    /**
     * @param ReflectionProperty|ReflectionParameter $reflection
     * @param ServerRequestInterface $request
     * @return mixed
     * @throws ReflectionException
     */
    public function resolveByReflection(
        ReflectionProperty|ReflectionParameter $reflection,
        ServerRequestInterface $request
    ): mixed {
        foreach ($reflection->getAttributes(BindAttribute::class, ReflectionAttribute::IS_INSTANCEOF) as $attribute) {
            if (null !== ($value = $this->resolveByAttribute($attribute, $reflection, $request))) {
                return $value;
            }
        }

        $name = static::getTypeName($reflection);

        if ($name && !array_key_exists($name, $this->defaultValues)) {
            if (is_a($name, ServerRequestInterface::class, true)) {
                return $request;
            }

            if ($this->container->has($name)) {
                return $this->container->get($name);
            }
        }

        if ($reflection instanceof ReflectionProperty) {
            if ($reflection->hasDefaultValue()) {
                return $reflection->getDefaultValue();
            }
        } else {
            if ($reflection->isDefaultValueAvailable()) {
                return $reflection->getDefaultValue();
            }

            if ($reflection->allowsNull()) {
                return null;
            }

            if ($name) {
                if ($reflection->getType()->allowsNull()) {
                    return null;
                }

                if (array_key_exists($name, $this->defaultValues)) {
                    return $this->defaultValues[$name];
                }

                if (is_a($name, Traversable::class, true)) {
                    return new ArrayObject();
                }

                if (class_exists($name)) {
                    $class = new ReflectionClass($name);
                    if ($class->isInstantiable() && !$class->isFinal()) {
                        return $class->newInstanceWithoutConstructor();
                    }
                }
            }
        }

        return null;
    }

    /**
     * @param ReflectionAttribute $attribute
     * @param ReflectionProperty|ReflectionParameter $reflection
     * @param ServerRequestInterface $request
     * @return mixed
     */
    public function resolveByAttribute(
        ReflectionAttribute $attribute,
        ReflectionProperty|ReflectionParameter $reflection,
        ServerRequestInterface $request
    ): mixed {
        /** @var BindAttribute $attr */
        $attr = $attribute->newInstance();
        $name = $reflection->getName();

        if ($attr instanceof BindResource) {
            $name = static::getTypeName($reflection) ?? throw new InvalidResourceException($name);
        } elseif ($attr instanceof Bind) {
            $name = $attr->name ?: $name;
        }

        return $this->resolveByType($attr->getType(), $name, $request);
    }

    /**
     * @param string $type
     * @param string $name
     * @param ServerRequestInterface $request
     * @return mixed
     */
    public function resolveByType(string $type, string $name, ServerRequestInterface $request): mixed
    {
        if (!$this->container->has($type)) {
            throw new ResolverNotFound(sprintf('Resolver type %s not found.', $type));
        }

        $resolver = $this->container->get($type);

        return $resolver->resolve($name, $request);
    }

    /**
     * @param ReflectionProperty|ReflectionParameter $reflection
     * @return string|null
     */
    public static function getTypeName(ReflectionProperty|ReflectionParameter $reflection): ?string
    {
        if ($reflection->hasType() && $reflection->getType() instanceof ReflectionNamedType) {
            return $reflection->getType()->getName();
        }

        return null;
    }
}