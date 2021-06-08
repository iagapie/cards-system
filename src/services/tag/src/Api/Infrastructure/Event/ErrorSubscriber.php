<?php

declare(strict_types=1);

namespace TagService\Api\Infrastructure\Event;

use IA\Mediator\Exception\ValidatorException;
use IA\Micro\Event\ErrorEvent;
use IA\Micro\Exception\HttpUnprocessableEntityException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class ErrorSubscriber implements EventSubscriberInterface
{
    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ErrorEvent::NAME => 'onError'
        ];
    }

    public function onError(ErrorEvent $event): void
    {
        $exception = $event->getException();

        if ($exception instanceof ValidatorException) {
            $event->setException(new HttpUnprocessableEntityException($exception->getErrors(), previous: $exception));
        }
    }
}