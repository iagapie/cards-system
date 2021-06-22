using Board.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Board.Api.Application.Validations
{
    public class UpdateBoardCommandValidator : ACommandValidator<UpdateBoardCommand>
    {
        public UpdateBoardCommandValidator(ILogger<UpdateBoardCommandValidator> logger)
        {
            RuleFor(command => command.Id).Must(ValidGuid).WithMessage("Please specify a valid board id");
            RuleFor(command => command.Name).NotEmpty().MaximumLength(150);
            RuleFor(command => command.Color).NotEmpty().MaximumLength(50);
            RuleFor(command => command.Description).MaximumLength(1000);
            
            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}