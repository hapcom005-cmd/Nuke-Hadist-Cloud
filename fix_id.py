import sys

with open('build_ui_premium_v3.js', 'r', encoding='utf-8') as f:
    lines = f.read().split('\\n')

for i in range(len(lines)):
    if 'class="notranslate"' in lines[i] and 'style="font-family:var(--font-arabic' in lines[i] and '${a.teksArab}' in lines[i]:
        # We want the file to have exactly: id="text-arab-${a.nomorAyat}"
        lines[i] = lines[i].replace('<div class="notranslate"', '<div id="text-arab-${a.nomorAyat}" class="notranslate"')

with open('build_ui_premium_v3.js', 'w', encoding='utf-8') as f:
    f.write('\\n'.join(lines))

print("Fixed with Python!")
