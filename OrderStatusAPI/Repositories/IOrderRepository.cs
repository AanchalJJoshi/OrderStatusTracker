using OrderStatusAPI.Model;

namespace OrderStatusAPI
{

public interface IOrderRepository
{
    Task<IEnumerable<Order>> SearchAsync(string query);
    Task<Order?> GetAsync(Guid orderId);
    Task SaveAsync(Order order);
}
}
