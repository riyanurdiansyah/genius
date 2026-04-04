import sys

with open('wwwroot/css/kuda-kit.css', 'r') as f:
    text = f.read()

# Replace .dt-style-bordered with empty string
text = text.replace('.dt-style-bordered', '')

# We also need to remove the old table.dataTable defaults which is before dt-style-bordered
start_marker = 'table.dataTable {\n    border-collapse: separate !important;\n    border-spacing: 0 10px !important;'
end_marker = 'table.dataTable tbody td:last-child {\n    border-top-right-radius: 12px;\n    border-bottom-right-radius: 12px;\n}\n\n'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker) + len(end_marker)

if start_idx != -1 and end_idx > start_idx:
    old_default = text[start_idx:end_idx]
    text = text.replace(old_default, '')

with open('wwwroot/css/kuda-kit.css', 'w') as f:
    f.write(text)
