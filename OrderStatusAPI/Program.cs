using Microsoft.OpenApi.Models;
using OrderStatusAPI;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Services
// --------------------

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Support Orders API",
        Version = "v1",
        Description = "Internal API for support and operations teams"
    });
});

// Dependency Injection
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


// builder.Services.AddAuthentication();
// builder.Services.AddAuthorization();

var app = builder.Build();

// --------------------
// Middleware pipeline
// --------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // enable in real environments

// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();

app.Run();
