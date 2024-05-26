using DBSiteNew.Data;
using DBSiteNew.ModelsDb;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DBSiteNew.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbSiteContext _context;

        public CartController(AppDbSiteContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("get/{userId}")]
        public async Task<IActionResult> GetCartItems(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .Select(ci => new CartItemResponseDto
                {
                    CartItemId = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                })
                .ToListAsync();

            return Ok(cartItems);
        }

        /*[HttpPost("{userId}")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] CartItem cartItem)
        {
            cartItem.UserId = userId;
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }*/
        [Authorize]
        [HttpPost("add/{userId}")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] CartItemDto cartItemDto)
        {
            // Проверяем, существует ли пользователь
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Проверяем, существует ли продукт
            var product = await _context.Products.FindAsync(cartItemDto.ProductId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Проверяем, существует ли уже элемент корзины для данного пользователя и продукта
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == cartItemDto.ProductId);

            if (existingCartItem != null)
            {
                // Обновляем количество
                existingCartItem.Quantity += cartItemDto.Quantity;
                _context.CartItems.Update(existingCartItem);
            }
            else
            {
                // Создаем новый элемент корзины
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = cartItemDto.ProductId,
                    Quantity = cartItemDto.Quantity,
                    User = user,
                    Product = product
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            // Возвращаем текущие данные корзины
            //return Ok(existingCartItem); // ?? cartItem);
            return Ok();
        }
        public class CartItemDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }
        public class CartItemResponseDto
        {
            public int CartItemId { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; } // добавил это
        }

        [Authorize]
        [HttpDelete("remove/{userId}/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int productId)
        {
            // Проверяем, существует ли элемент корзины у данного пользователя для указанного продукта
            var cartItem = await _context.CartItems
                .Where(ci => ci.UserId == userId && ci.ProductId == productId)
                .FirstOrDefaultAsync();

            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
