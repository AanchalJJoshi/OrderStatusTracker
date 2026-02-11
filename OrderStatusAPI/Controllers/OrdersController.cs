using Microsoft.AspNetCore.Mvc;
using OrderStatusAPI.Model;

namespace OrderStatusAPI
{
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    
 private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }
   
[HttpGet]
public async Task<IActionResult> Search([FromQuery] string query)
{
    if (string.IsNullOrWhiteSpace(query))
        return BadRequest("Search query is required.");

    var orders = await _orderService.SearchAsync(query);
    return Ok(orders);
}

[HttpGet("{orderId}")]
public async Task<IActionResult> Get(Guid orderId)
{
    var order = await _orderService.GetByIdAsync(orderId);
    if (order == null)
        return NotFound();

    return Ok(order);
}

[HttpPost("{orderId}/notes")]
public async Task<IActionResult> AddNote(
    Guid orderId,
    [FromBody] string note)
{
    if (string.IsNullOrWhiteSpace(note))
        return BadRequest("Note cannot be empty");

    await _orderService.AddNoteAsync(
        orderId,
        User.Identity?.Name ?? "support-agent",
        note);

    return NoContent();
}

[HttpPost("{orderId}/status")]
public async Task<IActionResult> UpdateStatus(
    Guid orderId,
    [FromBody] OrderStatus status)
{
    try
    {
        await _orderService.UpdateStatusAsync(
            orderId,
            status,
            User.Identity?.Name ?? "support-agent",
            null);

        return NoContent();
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(ex.Message);
    }
}
}
}