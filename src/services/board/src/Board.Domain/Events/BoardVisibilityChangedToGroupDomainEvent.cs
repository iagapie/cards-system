using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardVisibilityChangedToGroupDomainEvent : INotification
    {
        public Guid Id { get; }

        public BoardVisibilityChangedToGroupDomainEvent(Guid id) => Id = id;
    }
}