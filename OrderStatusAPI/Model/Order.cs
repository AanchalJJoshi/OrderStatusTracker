namespace OrderStatusAPI.Model
{
public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }

    public Customer Customer { get; set; }

    public List<OrderItem> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    public OrderStatus Status { get; set; }

    public List<OrderTimelineEntry> Timeline { get; set; } = new();
    public List<OrderNote> InternalNotes { get; set; } = new();
}

}