using iCognitus_test.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// SQLite
var connectionString = "Data Source=Data/iCognitus.db";
builder.Services.AddDbContext<DataContext>(options =>
	options.UseSqlite(connectionString));

// Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adiciona o CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Permite qualquer origem (pode ser restrito mais tarde)
              .AllowAnyMethod()   // Permite qualquer método HTTP
              .AllowAnyHeader();  // Permite qualquer cabeçalho
    });
});

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.RequireHttpsMetadata = false;
		options.SaveToken = true;
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = builder.Configuration["Jwt:Issuer"],
			ValidAudience = builder.Configuration["Jwt:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key não definida.")))
		};
	});

builder.Services.AddAuthorization();
var app = builder.Build();

app.UseCors("AllowAll");

// DB created
using (var scope = app.Services.CreateScope())
{
	var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
	dbContext.Database.EnsureCreated();
}

// Middleware
app.UseCors("AllowAll"); 
app.UseAuthentication();  
app.UseAuthorization();  

// Swagger config
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

// Map controllers
app.MapControllers();
app.Run();

