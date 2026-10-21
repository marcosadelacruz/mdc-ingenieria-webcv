"""Genera HTML estático a partir del perfil. Python 3, sin dependencias."""
from pathlib import Path
from html import escape
import json, re, shutil
root = Path(__file__).resolve().parent
profile = json.loads((root / 'content/profile.json').read_text())
e = escape
services = []
for i, item in enumerate(profile['services'], 1):
    opened = ' open' if i == 1 else ''
    services.append(f'<details name="services"{opened}><summary><span class="service-index">{i:02d}</span>{e(item["title"])}</summary><p>{e(item["body"])}</p><p class="deliverables">{e(item["deliverables"])}</p></details>')
experience = []
for i, item in enumerate(profile['experience'], 1):
    experience.append(f'<article class="experience-row"><span class="index">{i:02d}</span><div><h3>{e(item["company"])}</h3><p class="role">{e(item["role"])}</p><span class="context">{e(item["context"])}</span></div><p class="description">{e(item["body"])}</p></article>')
path = root / 'docs/index.html'
html = path.read_text()
for key, content in [('SERVICES', ''.join(services)), ('EXPERIENCE', ''.join(experience))]:
    pattern = f'<!-- {key}:START -->.*?<!-- {key}:END -->'
    html, count = re.subn(pattern, lambda _: f'<!-- {key}:START -->{content}<!-- {key}:END -->', html, flags=re.S)
    if count != 1:
        raise ValueError(f'Marcadores de contenido ausentes o duplicados: {key}')
wa_number = re.sub(r'\D', '', profile['phone'])
if not re.fullmatch(r'\d{8,15}', wa_number):
    raise ValueError('Número de WhatsApp inválido en el perfil')
html = re.sub(r'data-whatsapp-number="[^"]+"', f'data-whatsapp-number="{wa_number}"', html)
html = re.sub(r'https://wa\.me/\d+', f'https://wa.me/{wa_number}', html)
path.write_text(html)
source = root / 'content/cv.pdf'
if source.exists():
    shutil.copy2(source, root / 'docs/assets/Marcos-De-La-Cruz-CV.pdf')
print(f'HTML generado: {len(services)} servicios y {len(experience)} experiencias. CV listo.')
