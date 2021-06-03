<?php

declare(strict_types=1);

namespace CategoryService\Api\Controller;

use CategoryService\Api\Application\Command\AddPermission\AddPermissionCommand;
use CategoryService\Api\Application\Command\AddPermission\AddPermissionHandlerInterface;
use CategoryService\Api\Application\Command\RemovePermission\RemovePermissionCommand;
use CategoryService\Api\Application\Command\RemovePermission\RemovePermissionHandlerInterface;
use CategoryService\Api\Infrastructure\Bind\Attribute\BindResource;
use CategoryService\Api\Infrastructure\Middleware\Attribute\Validate;
use CategoryService\Api\Infrastructure\Middleware\ParameterValidatorMiddleware;
use IA\Route\Attribute\Delete;
use IA\Route\Attribute\Prefix;
use IA\Route\Attribute\Put;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

#[Prefix('/api/v1/categories/{categoryId}/permissions', ParameterValidatorMiddleware::class)]
final class PermissionController
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private AddPermissionHandlerInterface $addPermissionHandler,
        private RemovePermissionHandlerInterface $removePermissionHandler,
        private LoggerInterface $logger,
    ) {
    }

    #[Put('/{permission}')]
    public function add(#[BindResource, Validate] AddPermissionCommand $command): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $this->addPermissionHandler->handle($command);

        return $this->responseFactory->createResponse(204);
    }

    #[Delete('/{permission}')]
    public function remove(#[BindResource, Validate] RemovePermissionCommand $command): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $this->removePermissionHandler->handle($command);

        return $this->responseFactory->createResponse(204);
    }
}