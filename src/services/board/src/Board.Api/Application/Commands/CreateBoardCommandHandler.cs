using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class CreateBoardCommandHandler : IRequestHandler<CreateBoardCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<CreateBoardCommandHandler> _logger;

        public CreateBoardCommandHandler(IBoardRepository boardRepository, ILogger<CreateBoardCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> Handle(CreateBoardCommand command, CancellationToken cancellationToken)
        {
            var id = Guid.Parse(command.Id);
            var board = new Domain.AggregatesModel.BoardAggregate.Board(id, command.Name, command.OwnerId, command.Color, command.Description);
            
            _logger.LogInformation("----- Creating Board: {@Board}", board);
            
            _boardRepository.Add(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}