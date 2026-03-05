using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class ToolsController : Controller
{
    public IActionResult Design() => View();
    public IActionResult Report() => View();
}
