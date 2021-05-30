using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardVisibilityChangedToPublicDomainEvent : INotification
    {
        public Guid Id { get; }

        public BoardVisibilityChangedToPublicDomainEvent(Guid id) => Id = id;
    }
}