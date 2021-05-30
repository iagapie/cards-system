using System;
using System.Linq;

namespace Board.Api.Extensions
{
    public static class TypeExtensions
    {
        public static string GetGenericTypeName(this object o) => o.GetType().GetGenericTypeName();

        public static string GetGenericTypeName(this Type type)
        {
            if (!type.IsGenericType) return type.Name;

            var genericTypes = string.Join(",", type.GetGenericArguments().Select(t => t.Name).ToArray());

            return $"{type.Name.Remove(type.Name.IndexOf('`'))}<{genericTypes}>";
        }
    }
}