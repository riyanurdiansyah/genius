using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult LoginV1()
        {
            return View();
        }
    }
}
