#!/bin/bash

# Script: sync-cdn.sh
# Deskripsi: Mengambil semua dependency dan menggabungkannya ke satu file.
# Membangun folder kuda-cdn yang mandiri (self-contained).

CDN_DIR="kuda-cdn"
VENDOR_DIR="$CDN_DIR/vendor"

echo "🔄 Memulai Proses Bundling Kuda CDN..."

# 1. Persiapan Folder
mkdir -p "$VENDOR_DIR/css" "$VENDOR_DIR/js"
mkdir -p "$CDN_DIR/css" "$CDN_DIR/js" "$CDN_DIR/font" "$CDN_DIR/webfonts"

# 2. Download Dependencies
echo "📥 Mendownload CSS/JS Dependencies..."
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css -o "$VENDOR_DIR/css/fontawesome.css"
curl -s https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css -o "$VENDOR_DIR/css/bootstrap.css"
curl -s https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css -o "$VENDOR_DIR/css/datatables.css"

curl -s https://code.jquery.com/jquery-3.7.0.min.js -o "$VENDOR_DIR/js/jquery.js"
curl -s https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js -o "$VENDOR_DIR/js/datatables.js"

# 3. Download FontAwesome Webfonts (Penting!)
echo "📥 Mendownload FontAwesome Webfonts..."
FA_FONTS=("fa-brands-400.woff2" "fa-regular-400.woff2" "fa-solid-900.woff2" "fa-v4compatibility.woff2" "fa-brands-400.ttf" "fa-regular-400.ttf" "fa-solid-900.ttf")
for font in "${FA_FONTS[@]}"; do
    if [ ! -f "$CDN_DIR/webfonts/$font" ]; then
        curl -s "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/$font" -o "$CDN_DIR/webfonts/$font"
    fi
done

# 4. BUNDLING CSS
echo "📦 Bundling CSS..."
{
    echo "/* BUNDLED BY KUDA-KIT */"
    cat "$VENDOR_DIR/css/bootstrap.css"
    echo -e "\n"
    cat "$VENDOR_DIR/css/fontawesome.css"
    echo -e "\n"
    cat "$VENDOR_DIR/css/datatables.css"
    echo -e "\n"
    echo "/* KUDA KIT CORE */"
    cat "wwwroot/css/kuda-kit.css"
} > "$CDN_DIR/css/kuda-kit.css"

# 5. BUNDLING JS
echo "📦 Bundling JS..."
{
    echo "/* BUNDLED BY KUDA-KIT */"
    cat "$VENDOR_DIR/js/jquery.js"
    echo ";"
    cat "$VENDOR_DIR/js/datatables.js"
    echo ";"
    echo "/* KUDA KIT CORE */"
    cat "wwwroot/js/kuda-kit.js"
} > "$CDN_DIR/js/kuda-kit.js"

# 6. SYNC FONTS
echo "📂 Syncing local fonts..."
cp -R wwwroot/font/* "$CDN_DIR/font/"

echo "✅ SELESAI! Folder 'kuda-cdn' sekarang mandiri."
