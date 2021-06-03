<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Middleware;

use CategoryService\Api\Infrastructure\Exception\HttpUnprocessableEntityException;
use CategoryService\Api\Infrastructure\Middleware\Attribute\Validate;
use CategoryService\Api\Infrastructure\RequestHandler\ActionContext;
use CategoryService\Api\Infrastructure\RequestHandler\DefaultHandler;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ParameterValidatorMiddleware implements MiddlewareInterface
{
    public function __construct(private ValidatorInterface $validator, private LoggerInterface $logger)
    {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->logger->debug('Invoked {middleware}', ['middleware' => self::class]);

        /** @var ActionContext $ctx */
        $ctx = $request->getAttribute(DefaultHandler::ACTION_CONTEXT);

        $args = $ctx->getArguments();

        foreach ($ctx->getRefParameters() as $parameter) {
            if (empty($parameter->getAttributes(Validate::class))) {
                continue;
            }

            $errors = [];

            /** @var ConstraintViolationInterface $error */
            foreach ($this->validator->validate($args[$parameter->getName()]) as $error) {
                $errors[$error->getPropertyPath()] = $error->getMessage();
            }

            if (!empty($errors)) {
                $this->logger->debug('Validation non passed: {parameter}', ['parameter' => $parameter->getName()]);

                throw new HttpUnprocessableEntityException($errors);
            }
        }

        return $handler->handle($request);
    }
}