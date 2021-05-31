using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class RemoveBoardCommandHandler : IRequestHandler<RemoveBoardCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<RemoveBoardCommandHandler> _logger;

        public RemoveBoardCommandHandler(IBoardRepository boardRepository, ILogger<RemoveBoardCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public async Task<bool> Handle(RemoveBoardCommand command, CancellationToken cancellationToken)
        {
            var id = Guid.Parse(command.Id);
            var board = await _boardRepository.GetAsync(id);

            if (board == null) return false;
            
            _logger.LogInformation("----- Removing Board: {@Board}", board);
            
            _boardRepository.Remove(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}