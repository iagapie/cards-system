using System.Runtime.Serialization;
using MediatR;

namespace Board.Api.Application.Commands
{
    [DataContract]
    public record RemoveBoardCommand : IRequest<bool>
    {
        [DataMember] public string Id { get; init; }
    }
}