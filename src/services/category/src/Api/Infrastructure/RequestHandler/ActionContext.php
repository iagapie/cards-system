<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\RequestHandler;

use ReflectionMethod;
use ReflectionParameter;

final class ActionContext
{
    /**
     * @var callable
     */
    private $action;

    /**
     * ActionContext constructor.
     * @param callable $action
     * @param array<string, ReflectionParameter> $refParameters
     * @param array<string, mixed> $arguments
     */
    public function __construct(callable $action, private array $refParameters, private array $arguments)
    {
        $this->action = $action;
    }

    /**
     * @return callable
     */
    public function getAction(): callable
    {
        return $this->action;
    }

    /**
     * @param callable $action
     * @return $this
     */
    public function withAction(callable $action): self
    {
        $ctx = clone $this;
        $ctx->action = $action;
        return $ctx;
    }

    /**
     * @return array<string, ReflectionParameter>
     */
    public function getRefParameters(): array
    {
        return $this->refParameters;
    }

    /**
     * @param array<string, ReflectionParameter> $refParameters
     * @return $this
     */
    public function withRefParameters(array $refParameters): self
    {
        $ctx = clone $this;
        $ctx->refParameters = $refParameters;
        return $ctx;
    }

    /**
     * @return array<string, mixed>
     */
    public function getArguments(): array
    {
        return $this->arguments;
    }

    /**
     * @param array<string, mixed> $arguments
     * @return $this
     */
    public function withArguments(array $arguments): self
    {
        $ctx = clone $this;
        $ctx->arguments = $arguments;
        return $ctx;
    }
}