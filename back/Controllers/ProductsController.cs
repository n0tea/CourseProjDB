using DBSiteNew.Data;
using DBSiteNew.ModelsDb;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DBSiteNew.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbSiteContext _context;

        public ProductsController(AppDbSiteContext context)
        {
            _context = context;
        }

        [HttpGet("get")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("fromcart")]
        public async Task<ActionResult<IEnumerable<Product>>> CartProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // Другие методы API для создания, редактирования и удаления товаров
    }
}
