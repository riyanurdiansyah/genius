using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers
{
        [Route("/Login")]
        public class AuthController : Controller
        {
            [HttpGet("")]
            public IActionResult Login()
            {
                return View("LoginV2");
            }

            [HttpGet("/Auth/LoginV1")]
            public IActionResult LoginV1()
            {
                return View();
            }

            [HttpGet("/Auth/LoginV2")]
            public IActionResult LoginV2()
            {
                return View();
            }

            [HttpGet("/Auth/ChooseRoleV1")]
            public IActionResult ChooseRoleV1()
            {
                return View();
            }

            [HttpGet("/Auth/ChooseRoleV2")]
            public IActionResult ChooseRoleV2()
            {
                return View();
            }
        }
}
