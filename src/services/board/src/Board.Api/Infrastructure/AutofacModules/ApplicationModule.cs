using Autofac;
using Board.Api.Application.Queries;
using Board.Domain.AggregatesModel.BoardAggregate;
using Board.Infrastructure.Repositories;

namespace Board.Api.Infrastructure.AutofacModules
{
    public class ApplicationModule : Module
    {
        private readonly string _connectionString;

        public ApplicationModule(string connectionString) => _connectionString = connectionString;

        protected override void Load(ContainerBuilder builder)
        {
            builder
                .Register(c => new BoardQueries(_connectionString))
                .As<IBoardQueries>()
                .InstancePerLifetimeScope();

            builder
                .RegisterType<BoardRepository>()
                .As<IBoardRepository>()
                .InstancePerLifetimeScope();
        }
    }
}