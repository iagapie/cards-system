using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using MediatR;

namespace Card.Api.Application.Commands
{
    [DataContract]
    public record CreateCardCommand : IRequest<bool>
    {
        [DataMember, JsonIgnore] public string Id { get; init; }
        
        [DataMember, JsonPropertyName("owner_id"), Required]
        public string OwnerId { get; init; }
        
        [DataMember, JsonPropertyName("category_id"), Required]
        public string CategoryId { get; init; }
        
        [DataMember, JsonPropertyName("name"), Required]
        public string Name { get; init; }

        [DataMember, JsonPropertyName("position"), Required]
        public int Position { get; init; }
    }
}