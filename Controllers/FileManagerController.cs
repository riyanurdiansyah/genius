using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Linq;
using System.Collections.Generic;

namespace Kuda.Controllers;

public class FileManagerController : Controller
{
    private readonly IWebHostEnvironment _env;

    public FileManagerController(IWebHostEnvironment env)
    {
        _env = env;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public IActionResult GetFiles(string dir = "")
    {
        var rootPath = _env.ContentRootPath;
        var targetPath = string.IsNullOrEmpty(dir) ? rootPath : Path.Combine(rootPath, dir);

        // Security check to ensure targetPath is within rootPath
        if (!Path.GetFullPath(targetPath).StartsWith(Path.GetFullPath(rootPath)))
        {
            return BadRequest("Invalid directory path.");
        }

        if (!Directory.Exists(targetPath))
        {
            return NotFound("Directory not found.");
        }

        var excludeDirs = new[] { ".git", "bin", "obj", ".vs", "node_modules", ".gemini" };
        var directories = Directory.GetDirectories(targetPath)
            .Where(d => !excludeDirs.Contains(Path.GetFileName(d)))
            .Select(d => new
            {
                name = Path.GetFileName(d),
                path = GetRelativePath(rootPath, d).Replace("\\", "/"),
                isDirectory = true,
                extension = ""
            });

        var files = Directory.GetFiles(targetPath)
            .Select(f => new
            {
                name = Path.GetFileName(f),
                path = GetRelativePath(rootPath, f).Replace("\\", "/"),
                isDirectory = false,
                extension = Path.GetExtension(f)
            });

        var allItems = directories.Concat(files).OrderByDescending(x => x.isDirectory).ThenBy(x => x.name);
        return Json(allItems);
    }

    [HttpGet]
    public IActionResult GetFileContent(string path)
    {
        if (string.IsNullOrEmpty(path)) return BadRequest("Path is required.");

        var rootPath = _env.ContentRootPath;
        var filePath = Path.Combine(rootPath, path);

        // Security check
        if (!Path.GetFullPath(filePath).StartsWith(Path.GetFullPath(rootPath)))
        {
            return BadRequest("Invalid file path.");
        }

        if (!System.IO.File.Exists(filePath))
        {
            return NotFound("File not found.");
        }

        var content = System.IO.File.ReadAllText(filePath);
        return Content(content, "text/plain");
    }

    [HttpPost]
    public IActionResult SaveFileContent([FromForm] string path, [FromForm] string content)
    {
        if (string.IsNullOrEmpty(path)) return BadRequest(new { success = false, message = "Path is required." });

        var rootPath = _env.ContentRootPath;
        var filePath = Path.Combine(rootPath, path);

        // Security check
        if (!Path.GetFullPath(filePath).StartsWith(Path.GetFullPath(rootPath)))
        {
            return BadRequest(new { success = false, message = "Invalid file path." });
        }

        if (!System.IO.File.Exists(filePath))
        {
            return NotFound(new { success = false, message = "File not found." });
        }

        try
        {
            System.IO.File.WriteAllText(filePath, content ?? string.Empty);
            return Json(new { success = true, message = "File saved successfully." });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    private string GetRelativePath(string rootPath, string fullPath)
    {
        var root = Path.GetFullPath(rootPath).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        var full = Path.GetFullPath(fullPath);
        
        if (full.StartsWith(root))
        {
            var relPath = full.Substring(root.Length);
            return relPath.TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        }
        return fullPath;
    }
}
