using System;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardNameChangedDomainEvent : INotification
    {
        public Guid Id { get; }
        public string Name { get; }

        public BoardNameChangedDomainEvent(Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}