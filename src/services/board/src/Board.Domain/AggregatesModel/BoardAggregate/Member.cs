using System;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public class Member : Entity
    {
        private string _userId;

        public Role Role { get; private set; }
        private int _roleId;

        protected Member()
        {
        }

        public Member(Guid id, string userId, Role role)
        {
            Id = id;
            _userId = userId;
            _roleId = role.Id;
        }

        public string GetUserId() => _userId;

        public int GetRoleId() => _roleId;
    }
}