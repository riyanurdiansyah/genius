using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Fonts;
using Color = SixLabors.ImageSharp.Color;
using PointF = SixLabors.ImageSharp.PointF;

namespace Kuda.Controllers;

public class CaptchaController : Controller
{
    private static readonly char[] _chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray(); 

    private static readonly Random _rng = new();

    [HttpGet]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Image()
    {

        string code = GenerateCode(6);
        HttpContext.Session.SetString("CaptchaCode", code.ToUpperInvariant());

        const int W = 160, H = 50;
        using var img = new Image<Rgba32>(W, H);

        img.Mutate(ctx =>
        {

            ctx.Fill(Color.ParseHex("#e8ecf0"));

            for (int i = 0; i < 200; i++)
            {
                float x = (float)(_rng.NextDouble() * W);
                float y = (float)(_rng.NextDouble() * H);
                var dotColor = Color.FromRgba(
                    (byte)_rng.Next(150, 200),
                    (byte)_rng.Next(150, 200),
                    (byte)_rng.Next(150, 200),
                    (byte)_rng.Next(80, 140));
                ctx.Fill(dotColor, new EllipsePolygon(x, y, 1.5f));
            }

            for (int i = 0; i < 5; i++)
            {
                var lineColor = Color.FromRgba(
                    (byte)_rng.Next(100, 180),
                    (byte)_rng.Next(100, 180),
                    (byte)_rng.Next(100, 180),
                    (byte)_rng.Next(60, 120));
                var pen = Pens.Solid(lineColor, (float)(_rng.NextDouble() * 1.5 + 0.5));
                ctx.DrawLine(pen,
                    new PointF((float)(_rng.NextDouble() * W), (float)(_rng.NextDouble() * H)),
                    new PointF((float)(_rng.NextDouble() * W), (float)(_rng.NextDouble() * H)));
            }

            string[] tryFonts = { "Arial", "DejaVu Sans", "Liberation Sans", "Helvetica", "FreeSans" };
            FontFamily fontFamily = default;
            bool found = false;
            foreach (var name in tryFonts)
            {
                if (SystemFonts.TryGet(name, out fontFamily))
                {
                    found = true;
                    break;
                }
            }
            if (!found)
                fontFamily = SystemFonts.Families.First();

            var font = fontFamily.CreateFont(26, FontStyle.Bold);

            float charW = (float)W / code.Length;
            for (int i = 0; i < code.Length; i++)
            {
                float baseX = charW * i + charW * 0.1f;
                float baseY = H / 2f + (float)(_rng.NextDouble() * 10 - 5);

                var charColor = Color.FromRgba(
                    (byte)_rng.Next(20, 90),
                    (byte)_rng.Next(80, 160),
                    (byte)_rng.Next(90, 160),
                    255);

                ctx.DrawText(new RichTextOptions(font)
                {
                    Origin = new PointF(baseX, baseY),
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Center,
                }, code[i].ToString(), charColor);
            }
        });

        using var ms = new MemoryStream();
        img.SaveAsPng(ms);
        return File(ms.ToArray(), "image/png");
    }

    [HttpPost]
    public IActionResult Validate([FromBody] CaptchaValidateRequest req)
    {
        string? stored = HttpContext.Session.GetString("CaptchaCode");
        bool ok = !string.IsNullOrEmpty(stored) &&
                  string.Equals(stored, req.Code?.Trim().ToUpperInvariant(),
                                StringComparison.OrdinalIgnoreCase);

        if (ok) HttpContext.Session.Remove("CaptchaCode");

        return Json(new { success = ok });
    }

    private static string GenerateCode(int length)
    {
        var sb = new System.Text.StringBuilder(length);
        for (int i = 0; i < length; i++)
            sb.Append(_chars[_rng.Next(_chars.Length)]);
        return sb.ToString();
    }
}

public record CaptchaValidateRequest(string? Code);
