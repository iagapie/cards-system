<?php

declare(strict_types=1);

namespace CategoryService\Api\Controller;

use CategoryService\Api\Application\Command\CreateCategory\CreateCategoryCommand;
use CategoryService\Api\Application\Command\RemoveCategory\RemoveCategoryCommand;
use CategoryService\Api\Application\Command\UpdateCategory\UpdateCategoryCommand;
use CategoryService\Api\Application\Query\CategoryQueryInterface;
use CategoryService\Api\Application\Query\Criteria;
use CategoryService\Api\Application\Query\Range;
use IA\Mediator\MediatorInterface;
use IA\Route\Attribute\Delete;
use IA\Route\Attribute\Get;
use IA\Route\Attribute\Post;
use IA\Route\Attribute\Prefix;
use IA\Route\Attribute\Put;
use IA\Route\Generator\UrlGeneratorInterface;
use JsonSerializable;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Log\LoggerInterface;
use Ramsey\Uuid\Uuid;

use function json_encode;

#[Prefix('/api/v1/categories')]
final class CategoryController
{
    public const UUID_REGEX = '(?i)[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}';

    /**
     * CategoryController constructor.
     * @param ResponseFactoryInterface $responseFactory
     * @param StreamFactoryInterface $streamFactory
     * @param UrlGeneratorInterface $urlGenerator
     * @param MediatorInterface $mediator
     * @param CategoryQueryInterface $query
     * @param LoggerInterface $logger
     */
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private UrlGeneratorInterface $urlGenerator,
        private MediatorInterface $mediator,
        private CategoryQueryInterface $query,
        private LoggerInterface $logger,
    ) {
    }

    #[Get]
    public function getList(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $params = $request->getQueryParams();

        $criteria = new Criteria(
            (array)($params['category'] ?? []),
            $params['parent'] ?? null,
            $params['board'] ?? null,
        );

        $range = new Range((int)($params['skip'] ?? 0), (int)($params['limit'] ?? 0));

        $data = $this->query->getCategories($criteria, $range);

        return $this->response($data);
    }

    #[Get('/{id:'.self::UUID_REGEX.'}', 'category')]
    public function get(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = $this->query->getCategory($id);

        return $this->response($data);
    }

    #[Post]
    public function create(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = (array)$request->getParsedBody();

        $id = Uuid::uuid4()->toString();

        $command = new CreateCategoryCommand(
            $id,
            $data['parent_id'] ?? null,
            $data['board_id'] ?? '',
            $data['name'] ?? '',
            $data['description'] ?? null,
            $data['created_by'] ?? '',
            (int)($data['position'] ?? 0),
        );

        $this->mediator->send($command);

        $location = $this->urlGenerator->absolute($request->getUri(), 'category', ['id' => $id]);

        return $this->responseFactory->createResponse(201)->withHeader('Location', $location);
    }

    #[Put('/{id}')]
    public function update(ServerRequestInterface $request, string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = (array)$request->getParsedBody();

        $command = new UpdateCategoryCommand(
            $id,
            $data['parent_id'] ?? null,
            $data['name'] ?? '',
            $data['description'] ?? null,
            (int)($data['position'] ?? 0),
        );

        $this->mediator->send($command);

        return $this->responseFactory->createResponse(204);
    }

    #[Delete('/{id:'.self::UUID_REGEX.'}')]
    public function remove(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = new RemoveCategoryCommand($id);

        $this->mediator->send($command);

        return $this->responseFactory->createResponse(204);
    }

    /**
     * @param JsonSerializable $data
     * @return ResponseInterface
     */
    private function response(JsonSerializable $data): ResponseInterface
    {
        return $this->responseFactory
            ->createResponse()
            ->withBody($this->streamFactory->createStream(json_encode($data)));
    }
}