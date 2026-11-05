"""Refresh CSS/JS URLs when their content changes, avoiding stale browser caches."""
import hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for page in ['index.html','bao-gia.html','gioi-thieu.html']:
 path=ROOT/page
 def version(match):
  file=match.group(2);asset=ROOT/file
  if not asset.is_file():raise FileNotFoundError(file)
  digest=hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
  return match.group(1)+file+'?v='+digest+match.group(3)
 text=re.sub(r'((?:src|href)="\./)([^"?]+\.(?:js|css))(?:\?[^" ]*)?(" )',version,path.read_text())
 # Also covers attributes directly followed by > (the common markup here).
 text=re.sub(r'((?:src|href)="\./)([^"?]+\.(?:js|css))(?:\?[^" ]*)?(")',version,text)
 path.write_text(text)
