using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class AppsController : Controller
{
    public IActionResult Kanban() => View();
}
