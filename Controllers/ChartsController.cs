using Microsoft.AspNetCore.Mvc;

namespace Genius.Controllers;

public class ChartsController : Controller
{
    public IActionResult ApexCharts() => View();
    public IActionResult ChartJS() => View();
}
