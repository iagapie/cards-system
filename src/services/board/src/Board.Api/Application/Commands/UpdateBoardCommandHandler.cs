using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class UpdateBoardCommandHandler : IRequestHandler<UpdateBoardCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<UpdateBoardCommandHandler> _logger;

        public UpdateBoardCommandHandler(IBoardRepository boardRepository, ILogger<UpdateBoardCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public async Task<bool> Handle(UpdateBoardCommand command, CancellationToken cancellationToken)
        {
            var id = Guid.Parse(command.Id);
            var board = await _boardRepository.GetAsync(id);

            if (board == null) return false;
            
            board.SetName(command.Name);
            board.SetColor(command.Color);
            board.SetDescription(command.Description);
            
            _logger.LogInformation("----- Updating Board: {@Board}", board);
            
            _boardRepository.Update(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}