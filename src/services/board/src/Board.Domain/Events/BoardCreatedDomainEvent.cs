using MediatR;

namespace Board.Domain.Events
{
    public class BoardCreatedDomainEvent : INotification
    {
        public AggregatesModel.BoardAggregate.Board Board { get; }

        public BoardCreatedDomainEvent(AggregatesModel.BoardAggregate.Board board) => Board = board;
    }
}