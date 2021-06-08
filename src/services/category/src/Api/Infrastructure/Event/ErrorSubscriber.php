<?php

declare(strict_types=1);

namespace CategoryService\Api\Infrastructure\Event;

use CategoryService\Domain\Exception\DomainException;
use CategoryService\Domain\Exception\RecordConflictException;
use CategoryService\Domain\Exception\RecordNotFoundException;
use IA\Mediator\Exception\ValidatorException;
use IA\Micro\Event\ErrorEvent;
use IA\Micro\Exception\HttpBadRequestException;
use IA\Micro\Exception\HttpConflictException;
use IA\Micro\Exception\HttpNotFoundException;
use IA\Micro\Exception\HttpUnprocessableEntityException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class ErrorSubscriber implements EventSubscriberInterface
{
    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents(): array
    {
        return [ErrorEvent::NAME => 'onError'];
    }

    public function onError(ErrorEvent $event): void
    {
        $exception = $event->getException();

        if ($exception instanceof RecordNotFoundException) {
            $event->setException(new HttpNotFoundException(previous: $exception));
        } elseif ($exception instanceof RecordConflictException) {
            $event->setException(new HttpConflictException($exception->getConflict(), previous: $exception));
        } elseif ($exception instanceof DomainException) {
            $event->setException(new HttpBadRequestException(previous: $exception));
        } elseif ($exception instanceof ValidatorException) {
            $event->setException(new HttpUnprocessableEntityException($exception->getErrors(), previous: $exception));
        }
    }
}