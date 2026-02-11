 namespace OrderStatusAPI.Model
{

public class Customer
{
    public string Email { get; set; }
    public string Mobile { get; set; }
    public string FullName { get; set; }
}

public class OrderItem
{
    public string Sku { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
}