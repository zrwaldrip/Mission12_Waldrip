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
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, bool sortAsc = false)
        {
            IQueryable<Book> query = _context.Books;
            if (sortAsc)
            {
                query = query.OrderBy(x => x.Title) ;
            }
            
            var booksList = query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();
            
            
            var totalNumBooks = _context.Books.Count();
            return Ok(new
            {
                Books = booksList,
                TotalNumBooks = totalNumBooks
            });
        }
    }
}
