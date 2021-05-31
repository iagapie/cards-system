using System;
using System.Linq;
using System.Threading.Tasks;
using Board.Domain.AggregatesModel.BoardAggregate;
using Board.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;
using Polly;
using Polly.Retry;

namespace Board.Api.Infrastructure
{
    public class BoardContextSeed
    {
        public async Task SeedAsync(BoardContext context, ILogger<BoardContextSeed> logger)
        {
            var policy = CreatePolicy(logger, nameof(BoardContextSeed));

            await policy.ExecuteAsync(async () =>
            {
                using (context)
                {
                    await context.Database.MigrateAsync();

                    if (!context.Roles.Any())
                    {
                        context.Roles.AddRange(Role.List());

                        await context.SaveChangesAsync();
                    }
                }
            });
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<BoardContextSeed> logger, string prefix, int retries = 3) =>
            Policy.Handle<NpgsqlException>().WaitAndRetryAsync(
                retryCount: retries,
                sleepDurationProvider: retry => TimeSpan.FromSeconds(5),
                onRetry: (exception, timeSpan, retry, ctx) =>
                {
                    logger.LogWarning(exception,
                        "[{prefix}] Exception {ExceptionType} with message {Message} detected on attempt {retry} of {retries}",
                        prefix, exception.GetType().Name, exception.Message, retry, retries);
                }
            );
    }
}