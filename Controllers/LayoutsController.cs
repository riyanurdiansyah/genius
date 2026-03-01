using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class LayoutsController : Controller
{
    public IActionResult CollapsedMenu() => View();
    public IActionResult ContentNavbar() => View();
    public IActionResult ContentNavSidebar() => View();
    public IActionResult Horizontal() => View();
    public IActionResult WithoutMenu() => View();
    public IActionResult WithoutNavbar() => View();
    public IActionResult Fluid() => View();
    public IActionResult Container() => View();
    public IActionResult Blank() => View();
}
