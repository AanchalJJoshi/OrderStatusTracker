using OrderStatusAPI.Model;
namespace OrderStatusAPI
{
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Order>> SearchAsync(string query)
    {
        return await _repository.SearchAsync(query);
    }

    public async Task<Order?> GetByIdAsync(Guid orderId)
    {
        return await _repository.GetAsync(orderId);
    }

    public async Task AddNoteAsync(Guid orderId, string author, string note)
    {
        var order = await _repository.GetAsync(orderId)
            ?? throw new InvalidOperationException("Order not found.");

        order.InternalNotes.Add(new OrderNote
        {
            Id = Guid.NewGuid(),
            Author = author,
            Note = note,
            CreatedUtc = DateTime.UtcNow
        });

        await _repository.SaveAsync(order);
    }

    public async Task UpdateStatusAsync(
        Guid orderId,
        OrderStatus newStatus,
        string updatedBy,
        string? comment)
    {
        var order = await _repository.GetAsync(orderId)
            ?? throw new InvalidOperationException("Order not found.");

        if (!OrderStatusRules.CanTransition(order.Status, newStatus))
            throw new InvalidOperationException(
                $"Invalid status transition from {order.Status} to {newStatus}.");

        order.Status = newStatus;
        order.Timeline.Add(new OrderTimelineEntry
        {
            Status = newStatus,
            UpdatedBy = updatedBy,
            Comment = comment,
            TimestampUtc = DateTime.UtcNow
        });

        await _repository.SaveAsync(order);
    }

    public static class OrderStatusRules
{
    private static readonly Dictionary<OrderStatus, OrderStatus[]> AllowedTransitions =
        new()
        {
            { OrderStatus.Placed, new[] { OrderStatus.Paid, OrderStatus.Cancelled } },
            { OrderStatus.Paid, new[] { OrderStatus.Shipped, OrderStatus.Cancelled } },
            { OrderStatus.Shipped, new[] { OrderStatus.Delivered, OrderStatus.Cancelled } },
            { OrderStatus.Delivered, Array.Empty<OrderStatus>() },
            { OrderStatus.Cancelled, Array.Empty<OrderStatus>() }
        };

    public static bool CanTransition(OrderStatus from, OrderStatus to)
        => AllowedTransitions.TryGetValue(from, out var allowed)
           && allowed.Contains(to);
}

}
}
