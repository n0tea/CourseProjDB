namespace DBSiteNew.Data
{
    using DBSiteNew.ModelsDb;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Reflection.Emit;

        public class AppDbSiteContext : DbContext
        {
            public DbSet<User> Users { get; set; }
            public DbSet<Product> Products { get; set; }
            public DbSet<Order> Orders { get; set; }
            public DbSet<CartItem> CartItems { get; set; }
            public DbSet<UserOrder> UserOrders { get; set; }

            public AppDbSiteContext(DbContextOptions<AppDbSiteContext> options)
                : base(options)
            {
                //Database.EnsureCreated();
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<User>(entity =>
                {
                    entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                    entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                    entity.Property(e => e.Password).IsRequired();
                    entity.Property(e => e.RefreshToken).HasMaxLength(500);
                });

                modelBuilder.Entity<Product>(entity =>
                {
                    entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                    entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                    entity.Property(e => e.ImageUrl).HasMaxLength(500);
                });

                modelBuilder.Entity<Order>(entity =>
                {
                    entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                    entity.Property(e => e.DeliveryAddress).HasMaxLength(300);
                    entity.Property(e => e.OrderTime).IsRequired();
                });

                modelBuilder.Entity<CartItem>(entity =>
                {
                    entity.HasOne(d => d.User)
                          .WithMany(p => p.CartItems)
                          .HasForeignKey(d => d.UserId);
                    entity.HasOne(d => d.Product)
                          .WithMany()
                          .HasForeignKey(d => d.ProductId);
                });

                modelBuilder.Entity<UserOrder>(entity =>
                {
                    entity.HasKey(e => new { e.UserId, e.OrderId });
                    entity.HasOne(d => d.User)
                          .WithMany(p => p.UserOrders)
                          .HasForeignKey(d => d.UserId);
                    entity.HasOne(d => d.Order)
                          .WithMany(p => p.UserOrders)
                          .HasForeignKey(d => d.OrderId);
                });
            }
        }
}
