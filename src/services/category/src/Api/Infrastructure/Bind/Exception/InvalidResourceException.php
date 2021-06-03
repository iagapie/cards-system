<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Exception;

use InvalidArgumentException;

use function sprintf;

final class InvalidResourceException extends InvalidArgumentException implements BindException
{
    /**
     * InvalidResourceException constructor.
     * @param string $resource
     * @param \Throwable|null $previous
     */
    public function __construct(string $resource, ?\Throwable $previous = null)
    {
        parent::__construct(sprintf('Resource "%s" is not instantiable.', $resource), previous: $previous);
    }
}