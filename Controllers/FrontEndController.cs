using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class FrontEndController : Controller
{
    public IActionResult CompanyProfile() => View();
    public IActionResult TermsAndConditions() => View();
    public IActionResult InvoiceTemplate() => View();
    public IActionResult EmailTemplate() => View();
    public IActionResult AuditTrail() => View();
}
