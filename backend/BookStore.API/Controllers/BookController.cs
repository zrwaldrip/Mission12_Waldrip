using BookStore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace BookStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BooksDbContext _context;
        
        public BookController(BooksDbContext temp) => _context = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, bool sortAsc = false, string? categories = null)
        {
            IQueryable<Book> query = _context.Books;

            if (!string.IsNullOrWhiteSpace(categories))
            {
                var categoriesList = categories
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();

                if (categoriesList.Count > 0)
                {
                    query = query.Where(b => categoriesList.Contains(b.Category));
                }
            }

            if (sortAsc)
            {
                query = query.OrderBy(x => x.Title) ;
            }
            
            var totalNumBooks = query.Count();
            var booksList = query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new
            {
                Books = booksList,
                TotalNumBooks = totalNumBooks
            });
        }
        
        [HttpGet("GetCategories")]
        public IActionResult GetCategoriesTypes()
        {
            var projectTypes = _context.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(projectTypes);
        }
    }
}
