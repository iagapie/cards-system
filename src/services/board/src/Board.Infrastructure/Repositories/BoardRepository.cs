using System;
using System.Linq;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using Board.Domain.SeedWork;
using Microsoft.EntityFrameworkCore;

namespace Board.Infrastructure.Repositories
{
    public class BoardRepository : IBoardRepository
    {
        private readonly BoardContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public BoardRepository(BoardContext context) =>
            _context = context ?? throw new ArgumentNullException(nameof(context));

        public void Add(Domain.AggregatesModel.BoardAggregate.Board board) => _context.Boards.Add(board);

        public void Update(Domain.AggregatesModel.BoardAggregate.Board board) => _context.Boards.Update(board);

        public void Remove(Domain.AggregatesModel.BoardAggregate.Board board) => _context.Boards.Remove(board);

        public async Task<Domain.AggregatesModel.BoardAggregate.Board> GetAsync(Guid boardId)
        {
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null)
                board = _context.Boards.Local.FirstOrDefault(b => b.Id == boardId);

            if (board == null) return null;
            
            await _context.Entry(board).Collection(i => i.Members).Query().Include(x => x.Role).LoadAsync();

            return board;
        }
    }
}