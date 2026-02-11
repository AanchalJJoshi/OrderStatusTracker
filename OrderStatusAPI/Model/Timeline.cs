namespace OrderStatusAPI.Model
{
public class OrderTimelineEntry
{
    public DateTime TimestampUtc { get; set; }
    public OrderStatus Status { get; set; }
    public string UpdatedBy { get; set; }
    public string Comment { get; set; }
}
}
