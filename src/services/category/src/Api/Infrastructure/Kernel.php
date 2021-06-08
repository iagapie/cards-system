<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure;

use IA\Micro\Kernel as BaseKernel;

final class Kernel extends BaseKernel
{
    /**
     * {@inheritDoc}
     */
    public function getControllerDirs(): array
    {
        return [$this->getProjectDir().'/src/Api/Controller'];
    }
}