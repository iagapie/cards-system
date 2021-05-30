using System;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;

namespace Board.Domain.Events
{
    public class BoardMemberAddedDomainEvent : INotification
    {
        public Guid BoardId { get; }
        public Member Member { get; }

        public BoardMemberAddedDomainEvent(Guid boardId, Member member)
        {
            BoardId = boardId;
            Member = member;
        }
    }
}