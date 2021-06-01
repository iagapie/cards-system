<?php

declare(strict_types=1);

namespace CategoryService\Api\Controller;

use CategoryService\Api\Application\Command\CreateCategoryCommand;
use IA\Route\Attribute\Get;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class CategoryController
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private ValidatorInterface $validator,
        private LoggerInterface $logger,
    ) {
    }

    #[Get('/', 'home')]
    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('HOME ROUTE');

        //$data = (array)($request->getParsedBody() ?? []);

        $command = new CreateCategoryCommand('');

        $data = [];

        /** @var ConstraintViolationInterface $error */
        foreach ($this->validator->validate($command) as $error) {
            $data[$error->getPropertyPath()] = $error->getMessage();
        }

        $data = \json_encode($data);

        return $this->responseFactory->createResponse()->withBody($this->streamFactory->createStream($data));
    }
}