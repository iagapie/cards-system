using Board.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Validations
{
    public class RemoveMemberCommandValidator : ACommandValidator<RemoveMemberCommand>
    {
        public RemoveMemberCommandValidator(ILogger<RemoveMemberCommandValidator> logger)
        {
            RuleFor(command => command.BoardId).Must(ValidGuid).WithMessage("Please specify a valid board id");
            RuleFor(command => command.UserId).NotEmpty().Length(36);
            
            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}