using System;
using System.Threading.Tasks;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public interface IBoardRepository : IRepository<Board>
    {
        void Add(Board board);

        void Update(Board board);
        
        void Remove(Board board);

        Task<Board> GetAsync(Guid boardId);
    }
}