using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class FormElementsController : Controller
{
    public IActionResult BasicInputs() => View();
    public IActionResult InputGroups() => View();
    public IActionResult CustomOptions() => View();
    public IActionResult Editors() => View();
    public IActionResult FileUpload() => View();
    public IActionResult Pickers() => View();
    public IActionResult SelectTags() => View();
    public IActionResult Sliders() => View();
    public IActionResult Switches() => View();
    public IActionResult Extras() => View();
}
