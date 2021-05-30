using Autofac;
using Board.Domain.AggregatesModel.BoardAggregate;
using Board.Infrastructure.Repositories;

namespace Board.Api.Infrastructure.AutofacModules
{
    public class ApplicationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<BoardRepository>()
                .As<IBoardRepository>()
                .InstancePerLifetimeScope();
        }
    }
}