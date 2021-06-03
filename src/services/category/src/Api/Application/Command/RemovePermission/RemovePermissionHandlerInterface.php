<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemovePermission;

use CategoryService\Domain\Exception\RecordNotFoundException;

interface RemovePermissionHandlerInterface
{
    /**
     * @param RemovePermissionCommand $command
     * @throws RecordNotFoundException
     */
    public function handle(RemovePermissionCommand $command): void;
}