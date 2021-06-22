using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardColorChangedDomainEvent : INotification
    {
        public Guid Id { get; }
        public string Color { get; }

        public BoardColorChangedDomainEvent(Guid id, string color) => (Id, Color) = (id, color);
    }
}