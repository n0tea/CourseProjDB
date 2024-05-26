using System.Text.Json.Serialization;

namespace DBSiteNew.ModelsDb
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public Product Product { get; set; }
    }

    public class Order
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime OrderTime { get; set; }

        [JsonIgnore]
        public ICollection<UserOrder> UserOrders { get; set; }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? RefreshToken { get; set; }

        [JsonIgnore]  // чтобы избежать цикл в серелизации 
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        [JsonIgnore]
        public ICollection<UserOrder> UserOrders { get; set; }
    }

    public class UserOrder
    {
        public int UserId { get; set; }
        public int OrderId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public Order Order { get; set; }
    }
}

