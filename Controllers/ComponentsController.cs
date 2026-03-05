using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class ComponentsController : Controller
{
    public IActionResult DataTables() => View();
    public IActionResult Forms() => View();
    public IActionResult FormValidation() => View();
    public IActionResult Buttons() => View();
    public IActionResult Cards() => View();
    public IActionResult Notifications() => View();
    public IActionResult Modals() => View();
}
