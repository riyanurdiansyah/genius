using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class FormWizardController : Controller
{
    public IActionResult Numbered() => View();
    public IActionResult Icons() => View();
}
