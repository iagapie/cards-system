using System;
using System.Collections.Generic;
using System.Linq;
using Board.Domain.Events;
using Board.Domain.Exceptions;
using Board.Domain.SeedWork;
using static Board.Domain.AggregatesModel.BoardAggregate.Visibility;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public class Board : Entity, IAggregateRoot
    {
        private string _name;

        private string _ownerId;

        private string _description;

        public Visibility Visibility { get; private set; }
        private int _visibilityId;

        private readonly List<Member> _members;
        public IReadOnlyCollection<Member> Members => _members;

        protected Board() => _members = new List<Member>();

        public Board(Guid id, string name, string ownerId, Visibility visibility, string description) : this()
        {
            Id = id;
            _name = name;
            _ownerId = ownerId;
            _visibilityId = visibility.Id;
            _description = description;
            _members.Add(new Member(Guid.NewGuid(), ownerId, Role.Owner));

            AddDomainEvent(new BoardCreatedDomainEvent(this));
        }

        public void AddMember(string userId, Role role)
        {
            if (Role.Owner.Equals(role)) throw new BoardDomainException("Role Owner couldn't be added.");
            
            if (_members.Any(x => x.GetUserId() == userId && x.GetRoleId() == role.Id)) return;

            var member = new Member(Guid.NewGuid(), userId, role);
            _members.Add(member);

            AddDomainEvent(new BoardMemberAddedDomainEvent(Id, member));
        }

        public void RemoveMember(string userId, Role role)
        {
            if (Role.Owner.Equals(role)) throw new BoardDomainException("Role Owner couldn't be removed.");
            
            bool Predicate(Member x) => x.GetUserId() == userId && x.GetRoleId() == role.Id;

            var member = _members.Find(Predicate);

            if (member != null && _members.RemoveAll(Predicate) > 0)
                AddDomainEvent(new BoardMembersRemovedDomainEvent(Id, new[] {member}));
        }

        public void RemoveMembers(string userId)
        {
            bool Predicate(Member x) => Role.Owner.Id != x.GetRoleId() && x.GetUserId() == userId;

            var members = _members.FindAll(Predicate);

            if (members.Any() && _members.RemoveAll(Predicate) > 0)
                AddDomainEvent(new BoardMembersRemovedDomainEvent(Id, members));
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

        public int GetVisibilityId() => _visibilityId;

        public void MakePublic()
        {
            if (_visibilityId == Public.Id) return;

            _visibilityId = Public.Id;

            AddDomainEvent(new BoardVisibilityChangedToPublicDomainEvent(Id));
        }

        public void MakePrivate()
        {
            if (_visibilityId == Private.Id) return;

            _visibilityId = Private.Id;

            AddDomainEvent(new BoardVisibilityChangedToPrivateDomainEvent(Id));
        }

        public void MakeGroupVisible()
        {
            if (_visibilityId == Group.Id) return;

            _visibilityId = Group.Id;

            AddDomainEvent(new BoardVisibilityChangedToGroupDomainEvent(Id));
        }
    }
}