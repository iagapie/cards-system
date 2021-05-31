using Board.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Validations
{
    public class RemoveMemberRoleCommandValidator : ACommandValidator<RemoveMemberRoleCommand>
    {
        public RemoveMemberRoleCommandValidator(ILogger<RemoveMemberRoleCommandValidator> logger)
        {
            RuleFor(command => command.BoardId).Must(ValidGuid).WithMessage("Please specify a valid board id");
            RuleFor(command => command.UserId).NotEmpty().Length(36);
            RuleFor(command => command.RoleId).Must(BeValidRoleId).Must(BeValidNotOwner)
                .WithMessage("Please specify a valid role");
            
            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}