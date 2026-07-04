using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Data;
using StudioIA.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "studio.IA API",
        Version = "v1",
        Description =
            "API .NET 8 para substituir o mock atual da plataforma studio.IA.",
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<StudioIaDbContext>(options =>
{
    var rawConnectionString =
        builder.Configuration.GetConnectionString("DefaultConnection");
    var databaseDirectory = Path.Combine(builder.Environment.ContentRootPath, "App_Data");
    Directory.CreateDirectory(databaseDirectory);
    var databasePath = Path.Combine(databaseDirectory, "studioia.db");
    options.UseSqlite(
        string.IsNullOrWhiteSpace(rawConnectionString)
            ? $"Data Source={databasePath}"
            : rawConnectionString.Replace("studioia.db", databasePath));
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICatalogService, CatalogService>();
builder.Services.AddScoped<IClientAccountService, ClientAccountService>();
builder.Services.AddScoped<IConfiguredAgentService, ConfiguredAgentService>();
builder.Services.AddScoped<IPlatformSettingsService, PlatformSettingsService>();
builder.Services.AddScoped<IProvisioningService, ProvisioningService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<StudioIaDbContext>();
    dbContext.Database.EnsureCreated();
    await DbSeeder.SeedAsync(dbContext);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("frontend");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
