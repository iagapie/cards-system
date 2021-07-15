using Card.Api.Application.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Card.Api.Application.Validations
{
    public class CreateCardCommandValidator : ACommandValidator<CreateCardCommand>
    {
        public CreateCardCommandValidator(ILogger<CreateCardCommandValidator> logger)
        {
            RuleFor(command => command.Id).Must(ValidGuid).WithMessage("Please specify a valid id");
            RuleFor(command => command.Name).NotEmpty().MaximumLength(255);
            RuleFor(command => command.OwnerId).NotEmpty().Length(36);
            RuleFor(command => command.CategoryId).NotEmpty().Length(36);
            
            logger.LogTrace("----- INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }
}