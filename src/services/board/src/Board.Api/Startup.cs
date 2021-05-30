using System;
using System.Reflection;
using Autofac;
using Board.Api.Infrastructure.AutofacModules;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Board.Api.Infrastructure.Filters;
using Board.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Board.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddApplicationInsights(Configuration)
                .AddCustomMvc()
                .AddCustomHealthCheck(Configuration)
                .AddCustomDbContext(Configuration)
                .AddCustomSwagger()
                .AddCustomIntegrations()
                .AddCustomConfiguration();
        }
        
        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(new MediatorModule());
            builder.RegisterModule(new ApplicationModule());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Board Api v1"));
            }

            // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsPolicy");

            // app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapControllers();

                endpoints.MapHealthChecks("/hc", new HealthCheckOptions()
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
                });
                endpoints.MapHealthChecks("/liveness", new HealthCheckOptions
                {
                    Predicate = r => r.Name.Contains("self")
                });
            });
        }
    }

    public static class CustomExtensionMethods
    {
        public static IServiceCollection AddCustomIntegrations(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return services;
        }

        public static IServiceCollection AddCustomConfiguration(this IServiceCollection services)
        {
            services.AddOptions();
            
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Instance = context.HttpContext.Request.Path,
                        Status = StatusCodes.Status400BadRequest,
                        Detail = "Please refer to the errors property for additional details."
                    };

                    return new BadRequestObjectResult(problemDetails)
                    {
                        ContentTypes = { "application/problem+json", "application/problem+xml" }
                    };
                };
            });

            return services;
        }

        public static IServiceCollection AddCustomDbContext(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<BoardContext>(o => o.UseNpgsql(configuration["ConnectionString"], options =>
            {
                options.MigrationsAssembly(typeof(Startup).GetTypeInfo().Assembly.GetName().Name);
                options.EnableRetryOnFailure(15, TimeSpan.FromSeconds(30), null!);
            }));

            return services;
        }

        public static IServiceCollection AddApplicationInsights(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddApplicationInsightsTelemetry(configuration);
            services.AddApplicationInsightsKubernetesEnricher();

            return services;
        }

        public static IServiceCollection AddCustomMvc(this IServiceCollection services)
        {
            services.AddControllers(options =>
                {
                    options.Filters.Add(typeof(HttpGlobalExceptionFilter));
                    // options.Filters.Add(typeof(ValidateModelStateFilter));
                })
                .AddJsonOptions(options => options.JsonSerializerOptions.WriteIndented = true);

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .SetIsOriginAllowed((host) => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            return services;
        }

        public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Board HTTP API",
                    Version = "v1",
                    Description = "The Board Service HTTP API"
                });
            });

            return services;
        }

        public static IServiceCollection AddCustomHealthCheck(this IServiceCollection services,
            IConfiguration configuration)
        {
            var hcBuilder = services.AddHealthChecks();

            hcBuilder.AddCheck("self", () => HealthCheckResult.Healthy());

            hcBuilder.AddNpgSql(
                configuration["ConnectionString"],
                name: "BoardDB-check",
                tags: new[] {"boarddb"});

            return services;
        }
    }
}