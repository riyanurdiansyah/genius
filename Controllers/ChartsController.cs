using Microsoft.AspNetCore.Mvc;

namespace Kuda.Controllers;

public class ChartsController : Controller
{
    public IActionResult ApexCharts() => View();
    public IActionResult ChartJS() => View();
    public IActionResult GanttChart() => View();
    
}
