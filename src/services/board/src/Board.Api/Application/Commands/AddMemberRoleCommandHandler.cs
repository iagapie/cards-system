using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class AddMemberRoleCommandHandler : IRequestHandler<AddMemberRoleCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<AddMemberRoleCommandHandler> _logger;

        public AddMemberRoleCommandHandler(IBoardRepository boardRepository,
            ILogger<AddMemberRoleCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> Handle(AddMemberRoleCommand command, CancellationToken cancellationToken)
        {
            var boardId = Guid.Parse(command.BoardId);
            var board = await _boardRepository.GetAsync(boardId);

            if (board == null) return false;

            var role = Role.From(command.RoleId);
            board.AddMemberRole(command.UserId, role);

            _logger.LogInformation("----- Adding Member Role: {@Board} - {UserId} - {@Role}", board, command.UserId, role);

            _boardRepository.Update(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}