using Card.Api.Extensions;
using FluentValidation;

namespace Card.Api.Application.Validations
{
    public class ACommandValidator<T> : AbstractValidator<T>
    {
        protected bool ValidGuid(string id) => id.IsValidNotEmptyGuid();
    }
}