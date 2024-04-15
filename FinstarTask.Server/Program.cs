using FinstarTask.DAL;
using FinstarTask.DAL.Entities;
using FinstarTask.DAL.Repos;
using FinstarTask.Domain.Services;
using FinstarTask.Server;
using Microsoft.EntityFrameworkCore;

const string CONNECTIONS_STRING_VARIABLE_NAME = "MSSQL_CONNECTION_STRING";

#if DEBUG
Environment.SetEnvironmentVariable(CONNECTIONS_STRING_VARIABLE_NAME, "Server=(LocalDb)\\MSSQLLocalDB;Database=FinstarRD;Trusted_Connection=True;");
#endif
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options => options.Filters.Add(new ApiExceptionFilter()));
builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(Environment.GetEnvironmentVariable(CONNECTIONS_STRING_VARIABLE_NAME) 
        ?? throw new ApplicationException($"{CONNECTIONS_STRING_VARIABLE_NAME} is empty")
    )
);
builder.Services.AddScoped<BaseRepo<FinstarRowDbEntity>>();
builder.Services.AddScoped<IDataService, DataService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetService<ApplicationDbContext>()!;

        context.Database.SetCommandTimeout(600);
        await context.Database.EnsureCreatedAsync();
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}
app.Run();
