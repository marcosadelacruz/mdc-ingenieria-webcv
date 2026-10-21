"""Comprobaciones de integridad para el sitio estático. Ejecutar python3 tests/qa.py."""
from pathlib import Path
from html.parser import HTMLParser
import json, hashlib
root=Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.images=[];self.metas={};self.h1=0;self.articles=0;self.details=0;self.in_select=False;self.in_option=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='select':self.in_select=True
        if tag=='option':self.in_option=True
        if 'id' in a:self.ids.append(a['id'])
        for key in ('href','src'):
            if key in a:self.links.append(a[key])
        if tag=='img':self.images.append(a)
        if tag=='meta':self.metas[a.get('name',a.get('property'))]=a.get('content')
        if tag=='h1':self.h1+=1
        if tag=='article':self.articles+=1
        if tag=='details':self.details+=1
    def handle_endtag(self,tag):
        if tag=='select':self.in_select=False
        if tag=='option':self.in_option=False
    def handle_data(self,data):
        assert not (self.in_select and not self.in_option and data.strip()), 'Opción de selección sin etiqueta option'
html=(root/'docs/index.html').read_text()
a=Audit();a.feed(html)
assert len(a.ids)==len(set(a.ids)), 'IDs duplicados'
assert a.h1==1, 'Debe existir un H1'
assert a.articles==4 and a.details==7, 'Contenido estático incompleto'
for url in a.links:
    assert url and url!='#', f'Enlace vacío: {url}'
    if url.startswith('#'):assert url[1:] in a.ids, f'Ancla rota: {url}'
    elif ':' not in url:assert (root/'docs'/url).is_file(), f'Archivo ausente: {url}'
for img in a.images:
    assert img.get('alt') and int(img['width'])>0 and int(img['height'])>0, 'Imagen sin alternativa o dimensiones'
assert len(a.images)==3
assert 'Escribir por correo' not in html
assert html.count('id="quote-dialog"')==1 and 'data-quote-open' in html
assert a.metas.get('description') and a.metas.get('viewport') and a.metas.get('og:title')
profile=json.loads((root/'content/profile.json').read_text())
assert 'mailto:'+profile['email'] in a.links
assert 'tel:'+profile['phone'] in a.links
assert profile['linkedin'] in a.links
assert 'https://wa.me/'+profile['phone'].replace('+','') in a.links
assert 'data-whatsapp-number="'+profile['phone'].replace('+','')+'"' in html
assert hashlib.sha256((root/'content/cv.pdf').read_bytes()).digest()==hashlib.sha256((root/'docs/assets/Marcos-De-La-Cruz-CV.pdf').read_bytes()).digest(), 'CV diferente al original'
assert not any(x in html for x in ['· pendiente','window.PROFILE','assets/profile.js'])
print(f'PASS: {len(a.links)} referencias, {len(a.images)} imágenes, 4 servicios, 4 experiencias, 3 FAQ, metadatos y CV idéntico.')
