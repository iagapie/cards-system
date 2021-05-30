using System;
using System.IO;
using System.Net;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Board.Api;
using Board.Api.Extensions;
using Board.Api.Infrastructure;
using Board.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ILogger = Serilog.ILogger;

var configuration = GetConfiguration();
Log.Logger = CreateSerilogLogger(configuration);
try
{
    Log.Information("Configuring web host ({ApplicationContext})...", Program.AppName);
    var host = BuildHost(configuration, args);

    Log.Information("Applying migrations ({ApplicationContext})...", Program.AppName);
    host.MigrateDbContext<BoardContext>((context, services) =>
    {
        var logger = services.GetService<ILogger<BoardContextSeed>>();

        new BoardContextSeed()
            .SeedAsync(context, logger)
            .Wait();
    });

    Log.Information("Starting web host ({ApplicationContext})...", Program.AppName);
    host.Run();

    return 0;
}
catch (Exception e)
{
    Log.Fatal(e, "Program terminated unexpectedly ({ApplicationContext})!", Program.AppName);
    return 1;
}
finally
{
    Log.CloseAndFlush();
}

static IHost BuildHost(IConfiguration configuration, string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseSerilog()
        .UseServiceProviderFactory(new AutofacServiceProviderFactory())
        .ConfigureAppConfiguration(x => x.AddConfiguration(configuration))
        .ConfigureWebHostDefaults(webBuilder => webBuilder
            .CaptureStartupErrors(false)
            .ConfigureKestrel(options =>
            {
                options.Limits.Http2.KeepAlivePingDelay = TimeSpan.FromSeconds(10);
                options.Limits.Http2.KeepAlivePingTimeout = TimeSpan.FromSeconds(1);

                var port = GetHttpPort(configuration);
                options.Listen(IPAddress.Any, port,
                    listenOptions => { listenOptions.Protocols = HttpProtocols.Http1AndHttp2; });
            })
            .UseStartup<Startup>()
            .UseContentRoot(Directory.GetCurrentDirectory())
        )
        .Build();

static ILogger CreateSerilogLogger(IConfiguration configuration) => new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .Enrich.WithProperty("ApplicationContext", Program.AppName)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();

static IConfiguration GetConfiguration() => new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", false, true)
    .AddEnvironmentVariables()
    .Build();

static int GetHttpPort(IConfiguration config) => config.GetValue("PORT", 80);

public static class Program
{
    private static readonly string Namespace = typeof(Startup).Namespace;

    public static readonly string AppName =
        Namespace[(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1)..];
}