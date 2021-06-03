<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Bind\Exception;

use RuntimeException;

final class ResolverNotFound extends RuntimeException implements BindException
{
}