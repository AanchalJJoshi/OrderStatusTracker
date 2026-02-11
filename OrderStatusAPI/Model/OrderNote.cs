namespace OrderStatusAPI.Model
{
public class OrderNote
{
    public Guid Id { get; set; }
    public string Author { get; set; }
    public string Note { get; set; }
    public DateTime CreatedUtc { get; set; }
}
}