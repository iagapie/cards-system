<?php

declare(strict_types=1);

namespace TagService\Domain\Exception;

use Throwable;

final class RecordConflictException extends DomainException
{
    /**
     * RecordConflictException constructor.
     * @param string $conflict
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(private string $conflict, string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return string
     */
    public function getConflict(): string
    {
        return $this->conflict;
    }
}