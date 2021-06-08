<?php

declare(strict_types=1);

namespace TagService\Api\Application\Query;

final class Range
{
    /**
     * @var int
     */
    private int $skip;

    /**
     * @var int
     */
    private int $limit;

    /**
     * Range constructor.
     * @param int $skip
     * @param int $limit
     */
    public function __construct(int $skip, int $limit)
    {
        $this->skip = $skip < 0 ? 0 : $skip;
        $this->limit = $limit <= 0 || $limit > 50 ? 50 : $limit;
    }

    /**
     * @return int
     */
    public function getSkip(): int
    {
        return $this->skip;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }
}