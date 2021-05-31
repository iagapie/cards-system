using System;

namespace Board.Api.Extensions
{
    public static class StringExtensions
    {
        public static bool IsValidNotEmptyGuid(this string s) =>
            !string.IsNullOrWhiteSpace(s) && Guid.TryParse(s, out var guid) && Guid.Empty != guid;
    }
}