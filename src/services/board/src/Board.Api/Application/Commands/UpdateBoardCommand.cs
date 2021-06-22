using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using MediatR;

namespace Board.Api.Application.Commands
{
    [DataContract]
    public record UpdateBoardCommand : IRequest<bool>
    {
        [DataMember, JsonIgnore] public string Id { get; init; }

        [DataMember, JsonPropertyName("name"), Required]
        public string Name { get; init; }
        
        [DataMember, JsonPropertyName("color"), Required]
        public string Color { get; init; }

        [DataMember, JsonPropertyName("description")]
        public string Description { get; init; }
    }
}