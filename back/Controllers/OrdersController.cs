using DBSiteNew.Data;
using DBSiteNew.ModelsDb;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DBSiteNew.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbSiteContext _context;

        public OrdersController(AppDbSiteContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateOrder(int userId, [FromBody] CreateOrderRequest request)
        {
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            if (cartItems == null || !cartItems.Any())
            {
                return BadRequest("Cart is empty");
            }

            var totalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            var order = new Order
            {
                TotalAmount = totalAmount,
                DeliveryAddress = request.DeliveryAddress,
                OrderTime = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var cartItem in cartItems)
            {
                var userOrder = new UserOrder
                {
                    UserId = userId,
                    OrderId = order.Id
                };

                _context.UserOrders.Add(userOrder);
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }

    public class CreateOrderRequest
    {
        public string DeliveryAddress { get; set; }
    }
}
