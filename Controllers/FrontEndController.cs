using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class FrontEndController : Controller
{
    public IActionResult CompanyProfile() => View();
}
