using System;
using System.Threading;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Commands
{
    public class RemoveMemberRoleCommandHandler : IRequestHandler<RemoveMemberRoleCommand, bool>
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILogger<RemoveMemberRoleCommandHandler> _logger;

        public RemoveMemberRoleCommandHandler(IBoardRepository boardRepository, ILogger<RemoveMemberRoleCommandHandler> logger)
        {
            _boardRepository = boardRepository ?? throw new ArgumentNullException(nameof(boardRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public async Task<bool> Handle(RemoveMemberRoleCommand command, CancellationToken cancellationToken)
        {
            var boardId = Guid.Parse(command.BoardId);
            var board = await _boardRepository.GetAsync(boardId);

            if (board == null) return false;
            
            var role = Role.From(command.RoleId);
            board.RemoveMemberRole(command.UserId, role);

            _logger.LogInformation("----- Removing Member Role: {@Board} - {UserId} - {@Role}", board, command.UserId, role);
            
            _boardRepository.Update(board);

            return await _boardRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}