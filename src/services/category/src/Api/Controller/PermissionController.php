<?php

declare(strict_types=1);

namespace CategoryService\Api\Controller;

use CategoryService\Api\Application\Command\AddPermission\AddPermissionCommand;
use CategoryService\Api\Application\Command\RemovePermission\RemovePermissionCommand;
use CategoryService\Api\Infrastructure\Mediator\MediatorInterface;
use IA\Route\Attribute\Delete;
use IA\Route\Attribute\Prefix;
use IA\Route\Attribute\Put;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

#[Prefix('/api/v1/categories/{categoryId:'.CategoryController::UUID_REGEX.'}/permissions')]
final class PermissionController
{
    /**
     * PermissionController constructor.
     * @param ResponseFactoryInterface $responseFactory
     * @param MediatorInterface $mediator
     * @param LoggerInterface $logger
     */
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private MediatorInterface $mediator,
        private LoggerInterface $logger,
    ) {
    }

    #[Put('/{permission:[\-\w]+}')]
    public function add(string $categoryId, string $permission): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = new AddPermissionCommand($categoryId, $permission);

        $this->mediator->send($command);

        return $this->responseFactory->createResponse(204);
    }

    #[Delete('/{permission:[\-\w]+}')]
    public function remove(string $categoryId, string $permission): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = new RemovePermissionCommand($categoryId, $permission);

        $this->mediator->send($command);

        return $this->responseFactory->createResponse(204);
    }
}