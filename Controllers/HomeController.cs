using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
