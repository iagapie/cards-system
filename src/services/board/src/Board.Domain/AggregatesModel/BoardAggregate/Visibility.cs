using System;
using System.Collections.Generic;
using System.Linq;
using Board.Domain.Exceptions;
using Board.Domain.SeedWork;

namespace Board.Domain.AggregatesModel.BoardAggregate
{
    public class Visibility : Enumeration
    {
        /// <summary>
        /// Visible only by owner
        /// </summary>
        public static Visibility Private = new(1, nameof(Private).ToLowerInvariant());
        
        /// <summary>
        /// Visible by all
        /// </summary>
        public static Visibility Public = new(2, nameof(Public).ToLowerInvariant());
        
        /// <summary>
        /// Visible by all board members
        /// </summary>
        public static Visibility Group = new(3, nameof(Group).ToLowerInvariant());

        public Visibility(int id, string name) : base(id, name)
        {
        }

        public static IEnumerable<Visibility> List() => new[] {Private, Public, Group};

        public static Visibility FromName(string name) =>
            List().SingleOrDefault(x => string.Equals(x.Name, name, StringComparison.CurrentCultureIgnoreCase))
            ?? throw new BoardDomainException(
                $"Possible values for Visibility: {string.Join(",", List().Select(s => s.Name))}");

        public static Visibility From(int id) =>
            List().SingleOrDefault(x => x.Id == id)
            ?? throw new BoardDomainException(
                $"Possible values for Visibility: {string.Join(",", List().Select(s => s.Id))}");
    }
}