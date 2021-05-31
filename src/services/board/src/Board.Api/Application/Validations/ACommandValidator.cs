using System.Linq;
using Board.Api.Extensions;
using Board.Domain.AggregatesModel.BoardAggregate;
using FluentValidation;

namespace Board.Api.Application.Validations
{
    public abstract class ACommandValidator<T> : AbstractValidator<T>
    {
        protected bool ValidGuid(string id) => id.IsValidNotEmptyGuid();
        
        protected bool BeValidRoleId(int roleId) =>
            Role.List().SingleOrDefault(x => x.Id == roleId) != null;
        
        protected bool BeValidNotOwner(int roleId) => Role.Owner.Id != roleId;
    }
}