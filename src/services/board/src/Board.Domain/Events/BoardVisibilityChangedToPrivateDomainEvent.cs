using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardVisibilityChangedToPrivateDomainEvent : INotification
    {
        public Guid Id { get; }

        public BoardVisibilityChangedToPrivateDomainEvent(Guid id) => Id = id;
    }
}