using System;
using System.Collections.Generic;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardMemberRolesRemovedDomainEvent : INotification
    {
        public Guid BoardId { get; }
        public IEnumerable<Member> Members { get; }

        public BoardMemberRolesRemovedDomainEvent(Guid boardId, IEnumerable<Member> members) =>
            (BoardId, Members) = (boardId, members);
    }
}