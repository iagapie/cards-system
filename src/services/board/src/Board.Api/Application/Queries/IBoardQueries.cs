using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Board.Api.Application.Queries
{
    public interface IBoardQueries
    {
        Task<Board> GetBoard(Guid id);

        Task<CountBoards> Count(Criteria criteria);

        Task<BoardList> GetBoards(Criteria criteria, Range range, Sort sort);
    }
}