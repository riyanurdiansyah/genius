import os
import re

mapping = {
    '#1e293b': '#112e27',
    '#0f172a': '#0d221d',
    '#334155': 'rgba(59, 157, 130, 0.2)',
    '#475569': 'rgba(59, 157, 130, 0.3)',
    '#162032': '#122c25',
    '#1a2d40': '#14352d',
    '#2d3f53': '#1e4a3e',
    '#0f172a': '#0d221d',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changed = False
    in_dark_mode = False

    for i in range(len(lines)):
        line = lines[i]
        
        # Check if line enters a dark mode block or specifies [data-theme="dark"] inline
        if '[data-theme="dark"]' in line:
            if '{' in line and '}' not in line:
                in_dark_mode = True
            
        # Inline dark mode rule (e.g. [data-theme="dark"] .test { background: #1e293b; })
        is_inline_dark = '[data-theme="dark"]' in line
        if '[data-theme="dark"]' in line and '{' in line and '}' in line:
            is_inline_dark = True
            in_dark_mode = False # it opens and closes
            
        if in_dark_mode or is_inline_dark:
            for old_color, new_color in mapping.items():
                if old_color in line:
                    lines[i] = line.replace(old_color, new_color)
                    changed = True
                # also check uppercase versions
                if old_color.upper() in line:
                    lines[i] = line.replace(old_color.upper(), new_color)
                    changed = True

        if '}' in line and not ('{' in line and '}' in line):
            if in_dark_mode:
                in_dark_mode = False

    if changed:
        print(f"Updated {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)

for root, dirs, files in os.walk('/Users/kn/Documents/project/UIUX/Genius/'):
    if 'kuda-cdn' in root or 'bin' in root or 'obj' in root:
        continue
    for file in files:
        if file.endswith('.css') or file.endswith('.cshtml'):
            process_file(os.path.join(root, file))

