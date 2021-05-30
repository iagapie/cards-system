using System.Linq;
using System.Threading.Tasks;
using Board.Domain.SeedWork;
using MediatR;

namespace Board.Infrastructure
{
    static class MediatorExtension
    {
        public static async Task DispatchDomainEventsAsync(this IMediator mediator, BoardContext ctx)
        {
            var domainEntities = ctx.ChangeTracker
                .Entries<Entity>()
                .Where(x => x.Entity.DomainEvents != null && x.Entity.DomainEvents.Any());

            var entityEntries = domainEntities.ToList();
            var domainEvents = entityEntries
                .SelectMany(x => x.Entity.DomainEvents)
                .ToList();

            entityEntries.ForEach(entity => entity.Entity.ClearDomainEvents());

            foreach (var domainEvent in domainEvents)
                await mediator.Publish(domainEvent);
        }
    }
}