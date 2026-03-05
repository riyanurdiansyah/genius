using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Manufacturing()
    {
        return View();
    }

    public IActionResult Commercial()
    {
        return View();
    }
}
