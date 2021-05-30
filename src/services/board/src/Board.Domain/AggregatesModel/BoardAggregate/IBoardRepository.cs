using System;
using System.Threading.Tasks;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public interface IBoardRepository : IRepository<Board>
    {
        Board Add(Board board);

        Board Update(Board board);

        Task<Board> GetAsync(Guid boardId);
    }
}