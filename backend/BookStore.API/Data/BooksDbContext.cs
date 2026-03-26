using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

namespace BookStore.API.Data;

public class BooksDbContext : DbContext
{
    public BooksDbContext(DbContextOptions<BooksDbContext> options) : base(options)
    {
    }
    
    public DbSet<Book> Books { get; set; }
}