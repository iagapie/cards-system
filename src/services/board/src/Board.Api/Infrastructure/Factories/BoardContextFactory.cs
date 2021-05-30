using System.IO;
using System.Reflection;
using Board.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Board.Api.Infrastructure.Factories
{
    public class BoardContextFactory : IDesignTimeDbContextFactory<BoardContext>
    {
        public BoardContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<BoardContext>()
                .UseNpgsql(config["ConnectionString"],
                    o => o.MigrationsAssembly(typeof(Startup).GetTypeInfo().Assembly.GetName().Name));

            return new BoardContext(optionsBuilder.Options);
        }
    }
}