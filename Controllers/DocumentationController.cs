using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class DocumentationController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
