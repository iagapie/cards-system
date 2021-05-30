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

        public Domain.AggregatesModel.BoardAggregate.Board Add(Domain.AggregatesModel.BoardAggregate.Board board) =>
            _context.Boards.Add(board).Entity;

        public Domain.AggregatesModel.BoardAggregate.Board Update(Domain.AggregatesModel.BoardAggregate.Board board) =>
            _context.Boards.Update(board).Entity;

        public async Task<Domain.AggregatesModel.BoardAggregate.Board> GetAsync(Guid boardId)
        {
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null)
                board = _context.Boards.Local.FirstOrDefault(b => b.Id == boardId);

            if (board == null) return null;
            
            await _context.Entry(board).Reference(i => i.Visibility).LoadAsync();
            await _context.Entry(board).Collection(i => i.Members).LoadAsync();

            return board;
        }
    }
}