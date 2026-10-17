"""AYDA Express'in büyük HTML dosyasına salt sunum bağlantılarını ekler.
Mevcut sorulara, cevaplara, ilerleme saklamasına ve uygulama JS'ine dokunmaz.
Tekrar çalıştırılabilir (idempotent).
"""
from pathlib import Path
p=Path("express/index.html")
html=p.read_text(encoding="utf-8")
marker='<!-- AYDA express institutional refinement 2026 -->'
if marker not in html:
    css=marker+'\n<link rel="stylesheet" href="./ayda-2026-refine.css">\n'
    if "</head>" not in html:
        raise SystemExit("Express head bulunamadı; güvenli şekilde durduruldu.")
    html=html.replace("</head>",css+"</head>",1)
if 'src="./ayda-2026-refine.js"' not in html:
    if "</body>" not in html:
        raise SystemExit("Express body bulunamadı; güvenli şekilde durduruldu.")
    html=html.replace("</body>",'<script defer src="./ayda-2026-refine.js"></script>\n</body>',1)
p.write_text(html,encoding="utf-8")
print(f"Express korundu, görünüm güncellendi: {len(html):,} karakter")
