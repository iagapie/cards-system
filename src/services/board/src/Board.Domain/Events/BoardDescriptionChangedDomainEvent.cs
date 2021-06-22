using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardDescriptionChangedDomainEvent : INotification
    {
        public Guid Id { get; }
        public string Description { get; }

        public BoardDescriptionChangedDomainEvent(Guid id, string description) => (Id, Description) = (id, description);
    }
}