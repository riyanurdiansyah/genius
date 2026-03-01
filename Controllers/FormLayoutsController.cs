using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class FormLayoutsController : Controller
{
    public IActionResult VerticalForm() => View();
    public IActionResult HorizontalForm() => View();
    public IActionResult StickyActions() => View();
}
