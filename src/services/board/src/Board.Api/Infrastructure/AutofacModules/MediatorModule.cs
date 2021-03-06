using System.Reflection;
using Autofac;
using Board.Api.Application.Behaviors;
using Board.Api.Application.Commands;
using Board.Api.Application.Validations;
using FluentValidation;
using MediatR;

namespace Board.Api.Infrastructure.AutofacModules
{
    public class MediatorModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder
                .RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly)
                .AsImplementedInterfaces();

            builder
                .RegisterAssemblyTypes(typeof(CreateBoardCommand).GetTypeInfo().Assembly)
                .AsClosedTypesOf(typeof(IRequestHandler<,>));

            builder
                .RegisterAssemblyTypes(typeof(CreateBoardCommandValidator).GetTypeInfo().Assembly)
                .Where(t => t.IsClosedTypeOf(typeof(IValidator<>)))
                .AsImplementedInterfaces();

            builder.Register<ServiceFactory>(context =>
            {
                var componentContext = context.Resolve<IComponentContext>();
                return t => componentContext.TryResolve(t, out var o) ? o : null;
            });

            builder.RegisterGeneric(typeof(LoggingBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterGeneric(typeof(ValidatorBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterGeneric(typeof(TransactionBehaviour<,>)).As(typeof(IPipelineBehavior<,>));
        }
    }
}