using OrderStatusAPI.Model;

namespace OrderStatusAPI
{
public class OrderRepository : IOrderRepository
{
    // Simulated database
    private static readonly List<Order> _orders = SeedOrders();

    public Task<IEnumerable<Order>> SearchAsync(string query)
    {
        query = query.ToLower();

        var result = _orders.Where(o =>
            o.OrderNumber.Equals(query, StringComparison.OrdinalIgnoreCase) ||
            o.Customer.Email.ToLower().Contains(query) ||
            o.Customer.Mobile.Contains(query)
        );

        return Task.FromResult(result);
    }

    public Task<Order?> GetAsync(Guid orderId)
    {
        var order = _orders.FirstOrDefault(o => o.Id == orderId);
        return Task.FromResult(order);
    }

    public Task SaveAsync(Order order)
    {
        // In-memory list auto-updates since objects are reference types
        return Task.CompletedTask;
    }

    // --------------------
    // Seed data
    // --------------------
    private static List<Order> SeedOrders()
    {
        return new List<Order>
        {
            new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = "ORD-1001",
                Status = OrderStatus.Placed,
                Customer = new Customer
                {
                    FullName = "John Doe",
                    Email = "john.doe@email.com",
                    Mobile = "9876543210"
                },
                Items = new List<OrderItem>
                {
                    new OrderItem
                    {
                        Sku = "SKU-1",
                        Name = "Wireless Mouse",
                        Quantity = 1,
                        Price = 25
                    }
                },
                Subtotal = 25,
                Tax = 2.5m,
                Total = 27.5m,
                Timeline = new List<OrderTimelineEntry>
                {
                    new OrderTimelineEntry
                    {
                        Status = OrderStatus.Placed,
                        TimestampUtc = DateTime.UtcNow,
                        UpdatedBy = "system",
                        Comment = "Order placed"
                    }
                }
            }
        };
    }
}
}
