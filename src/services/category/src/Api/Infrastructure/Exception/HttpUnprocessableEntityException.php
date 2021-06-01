<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Exception;

use Throwable;

final class HttpUnprocessableEntityException extends HttpException
{
    /**
     * HttpTeapotException constructor.
     * @param array $errors
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(
        private array $errors,
        string $message = '',
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct(
            422,
            ['message' => 'Unprocessable entity.'],
            $message,
            $code,
            $previous
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getData(): array
    {
        return [...parent::getData(), ...$this->errors];
    }
}