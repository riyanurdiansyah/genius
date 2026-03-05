using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers
{
        [Route("/Login")]
        public class AuthController : Controller
        {
            [HttpGet("")]
            public IActionResult Login()
            {
                return View("LoginV1");
            }
            
            [HttpGet("/Auth/LoginV1")]
            public IActionResult LoginV1()
            {
                return View();
            }
        }
}
