<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Middleware;

use CategoryService\Api\Infrastructure\Exception\HttpException;
use CategoryService\Api\Infrastructure\Exception\HttpTeapotException;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Throwable;

final class ErrorMiddleware implements MiddlewareInterface
{
    /**
     * ErrorMiddleware constructor.
     * @param ResponseFactoryInterface $responseFactory
     * @param StreamFactoryInterface $streamFactory
     * @param LoggerInterface $logger
     * @param bool $debug
     */
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private LoggerInterface $logger,
        private bool $debug
    ) {
    }

    /**
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * @param Throwable $exception
     * @return ResponseInterface
     */
    private function handleException(Throwable $exception): ResponseInterface
    {
        $this->logger->error('Error Middleware handle exception', ['exception' => $exception]);

        if (!$exception instanceof HttpException) {
            $exception = new HttpTeapotException(previous: $exception);
        }

        $data = $exception->getData();

        if ($this->debug) {
            if ($message = $exception->getMessage() ?: $exception->getPrevious()?->getMessage()) {
                $data['developer_message'] = $message;
            }
            $data['trace'] = $exception->getTraceAsString();
        }

        if ($exception->getCode()) {
            $data['code'] = $exception->getCode();
        }

        $body = $this->streamFactory->createStream(\json_encode($data));

        return $this->responseFactory->createResponse($exception->getStatusCode())->withBody($body);
    }
}