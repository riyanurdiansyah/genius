using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class UIController : Controller
{
    public IActionResult Accordion() => View();
    public IActionResult Alerts() => View();
    public IActionResult Badges() => View();
    public IActionResult Buttons() => View();
    public IActionResult Carousel() => View();
    public IActionResult Collapse() => View();
    public IActionResult Dropdowns() => View();
    public IActionResult Footer() => View();
    public IActionResult ListGroups() => View();
    public IActionResult Modals() => View();
    public IActionResult Login() => View();
    public IActionResult Navbar() => View();
    public IActionResult Sidebar() => View();
    public IActionResult Offcanvas() => View();
    public IActionResult PaginationBreadcrumbs() => View();
    public IActionResult Progress() => View();
    public IActionResult Spinners() => View();
    public IActionResult TabsPills() => View();
    public IActionResult Toasts() => View();
    public IActionResult TooltipsPopovers() => View();
    public IActionResult Typography() => View();
}
