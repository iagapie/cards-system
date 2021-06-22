using Board.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Validations
{
    public class CreateBoardCommandValidator : ACommandValidator<CreateBoardCommand>
    {
        public CreateBoardCommandValidator(ILogger<CreateBoardCommandValidator> logger)
        {
            RuleFor(command => command.Id).Must(ValidGuid).WithMessage("Please specify a valid id");
            RuleFor(command => command.Name).NotEmpty().MaximumLength(150);
            RuleFor(command => command.Color).NotEmpty().MaximumLength(50);
            RuleFor(command => command.OwnerId).NotEmpty().Length(36);
            RuleFor(command => command.Description).MaximumLength(1000);

            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}