using Board.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Validations
{
    public class RemoveBoardCommandValidator : ACommandValidator<RemoveBoardCommand>
    {
        public RemoveBoardCommandValidator(ILogger<RemoveBoardCommandValidator> logger)
        {
            RuleFor(command => command.Id).Must(ValidGuid).WithMessage("Please specify a valid board id");
            
            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}