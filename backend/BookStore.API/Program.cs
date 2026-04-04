using Microsoft.EntityFrameworkCore;
using BookStore.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BooksDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

builder.Services.AddCors(options => 
    options.AddPolicy("AllowReactApp",
    policy => 
    {
        policy.WithOrigins("https://purple-wave-0042dc11e.7.azurestaticapps.net")
        .AllowAnyHeader()
        .AllowAnyMethod();
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
// Allow the React dev server (Vite) regardless of which localhost port it picked.
// This avoids "TypeError: Failed to fetch" caused by CORS blocking.
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
