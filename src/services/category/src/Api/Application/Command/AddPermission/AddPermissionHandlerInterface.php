<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\AddPermission;

use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;

interface AddPermissionHandlerInterface
{
    /**
     * @param AddPermissionCommand $command
     * @throws RecordNotFoundException
     * @throws RecordConflictException
     */
    public function handle(AddPermissionCommand $command): void;
}