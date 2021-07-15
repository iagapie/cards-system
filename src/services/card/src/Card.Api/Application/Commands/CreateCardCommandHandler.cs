using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Card.Api.Application.Commands
{
    public class CreateCardCommandHandler : IRequestHandler<CreateCardCommand, bool>
    {
        private readonly ILogger<CreateCardCommandHandler> _logger;

        public CreateCardCommandHandler(ILogger<CreateCardCommandHandler> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public Task<bool> Handle(CreateCardCommand command, CancellationToken cancellationToken)
        {
            var id = Guid.Parse(command.Id);
            
            throw new System.NotImplementedException();
        }
    }
}