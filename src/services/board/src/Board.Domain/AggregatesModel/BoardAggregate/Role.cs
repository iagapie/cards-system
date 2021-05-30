using System;
using System.Collections.Generic;
using System.Linq;
using Board.Domain.Exceptions;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public class Role : Enumeration
    {
        public static Role Owner = new(0, nameof(Owner).ToLowerInvariant());
        
        /// <summary>
        /// View Board Cards
        /// </summary>
        public static Role View = new(10, nameof(View).ToLowerInvariant());

        /// <summary>
        /// Create Card
        /// </summary>
        public static Role Create = new(20, nameof(Create).ToLowerInvariant());

        /// <summary>
        /// Edit Own Card
        /// </summary>
        public static Role Edit = new(30, nameof(Edit).ToLowerInvariant());

        /// <summary>
        /// Remove Own Card
        /// </summary>
        public static Role Remove = new(40, nameof(Remove).ToLowerInvariant());

        /// <summary>
        /// Extends all roles + apply roles on non personal cards (like an owner)
        /// </summary>
        public static Role Moderator = new(50, nameof(Moderator).ToLowerInvariant());

        public Role(int id, string name) : base(id, name)
        {
        }

        public static IEnumerable<Role> List() => new[] {Owner, View, Create, Edit, Remove, Moderator};

        public static Role FromName(string name) =>
            List().SingleOrDefault(x => string.Equals(x.Name, name, StringComparison.CurrentCultureIgnoreCase))
            ?? throw new BoardDomainException(
                $"Possible values for Role: {string.Join(",", List().Select(s => s.Name))}");

        public static Role From(int id) =>
            List().SingleOrDefault(x => x.Id == id)
            ?? throw new BoardDomainException(
                $"Possible values for Role: {string.Join(",", List().Select(s => s.Id))}");
    }
}