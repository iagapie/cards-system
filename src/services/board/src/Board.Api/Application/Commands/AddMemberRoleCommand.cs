using System.Runtime.Serialization;
using MediatR;

namespace Board.Api.Application.Commands
{
    [DataContract]
    public record AddMemberRoleCommand : IRequest<bool>
    {
        [DataMember] public string BoardId { get; init; }

        [DataMember] public string UserId { get; init; }

        [DataMember] public int RoleId { get; init; }
    }
}