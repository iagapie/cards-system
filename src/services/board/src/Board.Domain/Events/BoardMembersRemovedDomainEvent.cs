using System;
using System.Collections.Generic;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardMembersRemovedDomainEvent : INotification
    {
        public Guid BoardId { get; }
        public IEnumerable<Member> Members { get; }

        public BoardMembersRemovedDomainEvent(Guid boardId, IEnumerable<Member> members) =>
            (BoardId, Members) = (boardId, members);
    }
}