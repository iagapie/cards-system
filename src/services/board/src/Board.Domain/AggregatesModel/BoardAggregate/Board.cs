using System;
using System.Collections.Generic;
using System.Linq;
using Board.Domain.Events;
using Board.Domain.Exceptions;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public class Board : Entity, IAggregateRoot
    {
        private string _name;

        private string _ownerId;

        private string _description;

        private readonly List<Member> _members;
        public IReadOnlyCollection<Member> Members => _members;

        protected Board() => _members = new List<Member>();

        public Board(Guid id, string name, string ownerId, string description) : this()
        {
            Id = id;
            _name = name;
            _ownerId = ownerId;
            _description = description;
            _members.Add(new Member(Guid.NewGuid(), ownerId, Role.Owner));

            AddDomainEvent(new BoardCreatedDomainEvent(this));
        }

        public void AddMemberRole(string userId, Role role)
        {
            if (string.Equals(_ownerId, userId, StringComparison.InvariantCultureIgnoreCase))
                throw new BoardDomainException($"User {userId} is already a member.");
            
            if (Role.Owner.Equals(role)) throw new BoardDomainException("Role Owner couldn't be added.");
            
            if (_members.Any(x => x.GetUserId() == userId && x.GetRoleId() == role.Id)) return;

            var member = new Member(Guid.NewGuid(), userId, role);
            _members.Add(member);

            AddDomainEvent(new BoardMemberRoleAddedDomainEvent(Id, member));
        }

        public void RemoveMemberRole(string userId, Role role)
        {
            if (string.Equals(_ownerId, userId, StringComparison.InvariantCultureIgnoreCase))
                throw new BoardDomainException($"User {userId} is owner and role couldn't be removed.");
            
            bool Predicate(Member x) => x.GetUserId() == userId && x.GetRoleId() == role.Id;

            var member = _members.Find(Predicate);

            if (member != null && _members.RemoveAll(Predicate) > 0)
                AddDomainEvent(new BoardMemberRolesRemovedDomainEvent(Id, new[] {member}));
        }

        public void RemoveMember(string userId)
        {
            if (string.Equals(_ownerId, userId, StringComparison.InvariantCultureIgnoreCase))
                throw new BoardDomainException($"User {userId} is owner and couldn't be removed.");
            
            bool Predicate(Member x) => x.GetUserId() == userId;

            var members = _members.FindAll(Predicate);

            if (members.Any() && _members.RemoveAll(Predicate) > 0)
                AddDomainEvent(new BoardMemberRolesRemovedDomainEvent(Id, members));
        }

        public string GetOwnerId() => _ownerId;

        public string GetName() => _name;

        public void SetName(string name)
        {
            if (_name == name) return;
            _name = name;

            AddDomainEvent(new BoardNameChangedDomainEvent(Id, name));
        }

        public string GetDescription() => _description;

        public void SetDescription(string description)
        {
            if (_description == description) return;

            _description = description;

            AddDomainEvent(new BoardDescriptionChangedDomainEvent(Id, description));
        }
    }
}