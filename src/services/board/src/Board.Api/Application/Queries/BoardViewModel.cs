using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace Board.Api.Application.Queries
{
    public record Criteria
    {
        [FromQuery(Name = "user_id"), StringLength(36)]
        public string UserId { get; init; }

        [FromQuery(Name = "role_id"), RegularExpression("^(?:[1-5])?0$")]
        public int? RoleId { get; init; }
    }

    public record Range
    {
        [FromQuery(Name = "skip"), Range(0, long.MaxValue)]
        public long Skip { get; init; }

        [FromQuery(Name = "limit"), Range(0, 100)]
        public long Limit { get; init; } = 20;
    }

    public record Sort
    {
        [FromQuery(Name = "column"), RegularExpression("^owner_id|created_at|updated_at$")]
        public string Column { get; init; } = "updated_at";

        [FromQuery(Name = "direction"), RegularExpression("^asc|desc$")]
        public string Direction { get; init; } = "desc";
    }

    public record CountBoards
    {
        [JsonPropertyName("total")] public long Total { get; init; }
    }

    public record Board
    {
        [JsonPropertyName("id")] public Guid Id { get; init; }

        [JsonPropertyName("owner_id")] public string OwnerId { get; init; }

        [JsonPropertyName("name")] public string Name { get; init; }

        [JsonPropertyName("color")] public string Color { get; init; }

        [JsonPropertyName("description")] public string Description { get; init; }

        [JsonPropertyName("created_at")] public DateTimeOffset CreatedAt { get; init; }

        [JsonPropertyName("updated_at")] public DateTimeOffset UpdatedAt { get; init; }

        [JsonPropertyName("members"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public IEnumerable<Member> Members { get; init; }
    }

    public record Member
    {
        [JsonPropertyName("user_id")] public string UserId { get; init; }

        [JsonPropertyName("roles")] public IEnumerable<int> Roles { get; init; }
    }

    public record BoardList
    {
        [JsonPropertyName("boards")] public IEnumerable<Board> Boards { get; init; }
    }

    public record Role
    {
        [JsonPropertyName("id")] public int Id { get; init; }

        [JsonPropertyName("name")] public string Name { get; init; }
    }

    public record RoleList
    {
        [JsonPropertyName("roles")] public IEnumerable<Role> Roles { get; init; }
    }
}