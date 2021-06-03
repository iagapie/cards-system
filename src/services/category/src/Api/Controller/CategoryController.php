<?php

declare(strict_types=1);

namespace CategoryService\Api\Controller;

use CategoryService\Api\Application\Command\CreateCategory\CreateCategoryCommand;
use CategoryService\Api\Application\Command\CreateCategory\CreateCategoryHandlerInterface;
use CategoryService\Api\Application\Command\RemoveCategory\RemoveCategoryCommand;
use CategoryService\Api\Application\Command\RemoveCategory\RemoveCategoryHandlerInterface;
use CategoryService\Api\Application\Command\UpdateCategory\UpdateCategoryCommand;
use CategoryService\Api\Application\Command\UpdateCategory\UpdateCategoryHandlerInterface;
use CategoryService\Api\Application\Query\CategoryQueryInterface;
use CategoryService\Api\Infrastructure\Bind\Attribute\BindResource;
use CategoryService\Api\Infrastructure\Middleware\Attribute\Validate;
use CategoryService\Api\Infrastructure\Middleware\ParameterValidatorMiddleware;
use IA\Route\Attribute\Delete;
use IA\Route\Attribute\Get;
use IA\Route\Attribute\Post;
use IA\Route\Attribute\Prefix;
use IA\Route\Attribute\Put;
use IA\Route\Generator\UrlGeneratorInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Log\LoggerInterface;
use Ramsey\Uuid\Uuid;

use function json_encode;

#[Prefix('/api/v1/categories', ParameterValidatorMiddleware::class)]
final class CategoryController
{
    public const UUID_REGEX = '(?i)[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}';

    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private UrlGeneratorInterface $urlGenerator,
        private LoggerInterface $logger,
        private CreateCategoryHandlerInterface $createCategoryHandler,
        private UpdateCategoryHandlerInterface $updateCategoryHandler,
        private RemoveCategoryHandlerInterface $removeCategoryHandler,
        private CategoryQueryInterface $query,
    ) {
    }

    #[Get]
    public function all(): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = [];

        return $this->response($data);
    }

    #[Get('/{id:'.self::UUID_REGEX.'}', 'category-one')]
    public function one(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = [$id];

        return $this->response($data);
    }

    #[Post]
    public function createCategory(
        ServerRequestInterface $request,
        #[BindResource, Validate] CreateCategoryCommand $command
    ): ResponseInterface {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = $command->withId(Uuid::uuid4()->toString());

        $this->createCategoryHandler->handle($command);

        $location = $this->urlGenerator->absolute($request->getUri(), 'category-one', ['id' => $command->getId()]);

        return $this->responseFactory->createResponse(201)->withHeader('Location', $location);
    }

    #[Put('/{id}')]
    public function updateCategory(#[BindResource, Validate] UpdateCategoryCommand $command): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $this->updateCategoryHandler->handle($command);

        return $this->responseFactory->createResponse(204);
    }

    #[Delete('/{id:'.self::UUID_REGEX.'}')]
    public function removeCategory(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = new RemoveCategoryCommand($id);
        $this->removeCategoryHandler->handle($command);

        return $this->responseFactory->createResponse(204);
    }

    /**
     * @param array $data
     * @return ResponseInterface
     */
    private function response(array $data): ResponseInterface
    {
        return $this->responseFactory
            ->createResponse()
            ->withBody($this->streamFactory->createStream(json_encode($data)));
    }
}