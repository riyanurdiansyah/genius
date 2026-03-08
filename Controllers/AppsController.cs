using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class AppsController : Controller
{
    public IActionResult Kanban() => View();
    public IActionResult TrackingDriver() => View();
    public IActionResult TrackingTransaction() => View();
    public IActionResult Chat() => View();
    public IActionResult Email() => View();
    public IActionResult Calendar() => View();
}
