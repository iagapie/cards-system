using System;
using System.Collections.Generic;
using MediatR;

namespace Board.Domain.SeedWork
{
    public abstract class Entity
    {
        private int? _requestedHashCode;
        private Guid _id;
        private DateTimeOffset _createdAt = DateTimeOffset.UtcNow;
        private DateTimeOffset _updatedAt = DateTimeOffset.UtcNow;

        private List<INotification> _domainEvents;

        public Guid Id
        {
            get => _id;
            protected set => _id = value;
        }

        public DateTimeOffset CreatedAt
        {
            get => _createdAt;
            protected set => _createdAt = value;
        }

        public DateTimeOffset UpdatedAt
        {
            get => _updatedAt;
            protected set => _updatedAt = value;
        }

        public IReadOnlyCollection<INotification> DomainEvents => _domainEvents?.AsReadOnly();

        public void AddDomainEvent(INotification eventItem)
        {
            _domainEvents ??= new List<INotification>();
            _domainEvents.Add(eventItem);
        }

        public void RemoveDomainEvent(INotification eventItem) => _domainEvents?.Remove(eventItem);

        public void ClearDomainEvents() => _domainEvents?.Clear();

        public bool IsTransient() => Id == default;

        public void SetUpdatedAt() => UpdatedAt = DateTimeOffset.UtcNow;

        public override bool Equals(object obj)
        {
            if (obj is not Entity item)
                return false;

            if (ReferenceEquals(this, item))
                return true;

            if (GetType() != item.GetType())
                return false;

            if (item.IsTransient() || IsTransient())
                return false;

            return item.Id == Id;
        }

        public override int GetHashCode()
        {
            if (IsTransient()) return base.GetHashCode();

            // XOR for random distribution (https://docs.microsoft.com/en-us/archive/blogs/ericlippert/guidelines-and-rules-for-gethashcode)
            _requestedHashCode ??= Id.GetHashCode() ^ 31;

            return _requestedHashCode.Value;
        }

        public static bool operator ==(Entity left, Entity right) => left?.Equals(right) ?? object.Equals(right, null);

        public static bool operator !=(Entity left, Entity right) => !(left == right);
    }
}