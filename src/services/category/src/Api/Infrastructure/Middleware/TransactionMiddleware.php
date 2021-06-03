<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Middleware;

use Doctrine\DBAL\Connection;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Throwable;

final class TransactionMiddleware implements MiddlewareInterface
{
    /**
     * TransactionMiddleware constructor.
     * @param Connection $connection
     * @param LoggerInterface $logger
     */
    public function __construct(private Connection $connection, private LoggerInterface $logger)
    {
    }

    /**
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     * @return ResponseInterface
     * @throws Throwable
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->logger->info('Starting dbal transaction');
        $this->connection->beginTransaction();

        try {
            $response = $handler->handle($request);

            $this->logger->info('Committing dbal transaction');
            $this->connection->commit();

            return $response;
        } catch (Throwable $e) {
            $this->logger->info('Rolling back dbal transaction');
            $this->connection->rollBack();

            throw $e;
        }
    }
}