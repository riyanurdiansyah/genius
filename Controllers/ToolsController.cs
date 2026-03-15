using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class ToolsController : Controller
{
    public IActionResult Design() => View();
    public IActionResult Report() => View();
    public IActionResult Share(string id) 
    {
        ViewBag.ProjectId = id;
        return View();
    }
}
