using System.Text.Json.Serialization;

namespace Board.Api.Infrastructure.Filters
{
    public class JsonErrorResponse
    {
        [JsonPropertyName("messages")] public string[] Messages { get; set; }

        [JsonPropertyName("developer_message"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object DeveloperMessage { get; set; }
    }
}