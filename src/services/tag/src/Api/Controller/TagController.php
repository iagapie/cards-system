<?php

declare(strict_types=1);

namespace TagService\Api\Controller;

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
use TagService\Api\Application\Command\CreateTagCommand;
use TagService\Api\Application\Command\RemoveTagCommand;
use TagService\Api\Application\Command\UpdateTagCommand;
use TagService\Api\Application\Query\Criteria;
use TagService\Api\Application\Query\Range;
use TagService\Api\Application\Query\TagQueryInterface;

use function json_encode;

#[Prefix('/api/v1/tags')]
final class TagController
{
    public const UUID_REGEX = '(?i)[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}';

    /**
     * TagController constructor.
     * @param ResponseFactoryInterface $responseFactory
     * @param StreamFactoryInterface $streamFactory
     * @param UrlGeneratorInterface $urlGenerator
     * @param MediatorInterface $mediator
     * @param TagQueryInterface $query
     * @param LoggerInterface $logger
     */
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private UrlGeneratorInterface $urlGenerator,
        private MediatorInterface $mediator,
        private TagQueryInterface $query,
        private LoggerInterface $logger,
    ) {
    }

    #[Get]
    public function getList(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $params = $request->getQueryParams();

        $criteria = new Criteria((array)($params['tag'] ?? []), $params['board'] ?? null);

        $range = new Range((int)($params['skip'] ?? 0), (int)($params['limit'] ?? 0));

        $data = $this->query->getTags($criteria, $range);

        return $this->response($data);
    }

    #[Get('/{id:'.self::UUID_REGEX.'}', 'tag')]
    public function get(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = $this->query->getTag($id);

        return $this->response($data);
    }

    #[Post]
    public function create(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = (array)$request->getParsedBody();

        $id = Uuid::uuid4()->toString();

        $command = new CreateTagCommand($id, $data['board_id'] ?? '', $data['name'] ?? '', $data['color'] ?? '');

        $this->mediator->send($command);

        $location = $this->urlGenerator->absolute($request->getUri(), 'tag', ['id' => $id]);

        return $this->responseFactory->createResponse(201)->withHeader('Location', $location);
    }

    #[Put('/{id}')]
    public function update(ServerRequestInterface $request, string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $data = (array)$request->getParsedBody();

        $command = new UpdateTagCommand($id, $data['name'] ?? '', $data['color'] ?? '');

        $this->mediator->send($command);

        return $this->responseFactory->createResponse(204);
    }

    #[Delete('/{id:'.self::UUID_REGEX.'}')]
    public function remove(string $id): ResponseInterface
    {
        $this->logger->debug('ACTION -- {method}', ['method' => __METHOD__]);

        $command = new RemoveTagCommand($id);

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