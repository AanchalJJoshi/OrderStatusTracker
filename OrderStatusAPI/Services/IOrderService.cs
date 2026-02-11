using OrderStatusAPI.Model;
namespace OrderStatusAPI
{
public interface IOrderService
{
    Task<IEnumerable<Order>> SearchAsync(string query);
    Task<Order?> GetByIdAsync(Guid orderId);
    Task AddNoteAsync(Guid orderId, string author, string note);
    Task UpdateStatusAsync(
        Guid orderId,
        OrderStatus newStatus,
        string updatedBy,
        string? comment);
}
}
