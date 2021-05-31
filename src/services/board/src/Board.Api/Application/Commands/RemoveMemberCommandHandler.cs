using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class RemoveMemberCommandHandler : IRequestHandler<RemoveMemberCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<RemoveMemberCommandHandler> _logger;

        public RemoveMemberCommandHandler(IBoardRepository boardRepository, ILogger<RemoveMemberCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public async Task<bool> Handle(RemoveMemberCommand command, CancellationToken cancellationToken)
        {
            var boardId = Guid.Parse(command.BoardId);
            var board = await _boardRepository.GetAsync(boardId);

            if (board == null) return false;
            
            board.RemoveMember(command.UserId);

            _logger.LogInformation("----- Removing Member: {@Board} - {UserId}", board, command.UserId);
            
            _boardRepository.Update(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}