using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class FormWizardController : Controller
{
    public IActionResult Numbered() => View();
    public IActionResult Icons() => View();
}
