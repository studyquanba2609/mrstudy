"""Import product metadata and apply the owner's markup by product type once."""
import json,re,unicodedata,urllib.request
from datetime import datetime,timezone
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://taoquangsang.vn/'
DEFAULT_MARKUP=700_000

def markup_for(name):
 # Match AirPods before charger words: e.g. "AirPods 5 (SẠC THƯỜNG)".
 folded=unicodedata.normalize('NFKD',name.casefold()).replace('đ','d')
 folded=''.join(c for c in folded if not unicodedata.combining(c))
 if re.search(r'\bair\s?pods\b',folded):return 400_000
 if re.search(r'\b(?:sac|cap|earpods|ear pods)\b|tai nghe (?:co )?day',folded):return 100_000
 if 'tai nghe' in folded and re.search(r'khong day|bluetooth|wireless|tws',folded):return 400_000
 return DEFAULT_MARKUP
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='tr':self.row=[]
  if tag in ('td','th') and self.row is not None:self.cell=[]
  if tag=='br' and self.cell is not None:self.cell.append(' ')
 def handle_data(self,text):
  if self.cell is not None:self.cell.append(text)
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:
   self.row.append(' '.join(unicodedata.normalize('NFKC',''.join(self.cell)).split()));self.cell=None
  if tag=='tr' and self.row is not None:self.rows.append(self.row);self.row=None

def parse(html):
 parser=Tables();parser.feed(html);items=[];seen=set()
 for row in parser.rows:
  if len(row)<2 or not row[0] or row[0].upper().startswith('TÊN SẢN PHẨM'):continue
  name,raw=row[:2];numeric=re.fullmatch(r'\d{1,3}(?:[.,]\d{3})+',raw)
  sold=bool(re.search('HẾT|HET|LIÊN HỆ',raw.upper()))
  if not numeric and not sold:continue
  base=int(re.sub(r'\D','',raw)) if numeric else None
  if base is not None and not 100_000<=base<=300_000_000:raise ValueError('Unexpected price range')
  key=tuple(row)
  if key in seen:continue
  seen.add(key)
  accessory=bool(re.search(r'airpods|earpods|sạc|cáp|tai nghe|ốp lưng',name,re.I))
  items.append(dict(name=name,category='accessory' if accessory else ('phone' if len(row)>=6 else 'device'),price=base+markup_for(name) if base is not None else None,status=row[2] if len(row)>2 else '',sim=row[3] if len(row)>=6 else '',origin=row[4] if len(row)>=6 else '',availability='priced' if base is not None else 'unavailable'))
 if len(items)<20:raise ValueError('Source layout changed or unavailable; keep previous data')
 return dict(updatedAt=datetime.now(timezone.utc).isoformat(),items=items)
if __name__=='__main__':
 request=urllib.request.Request(SOURCE,headers={'User-Agent':'MRSTUDY price updater/1.0'})
 with urllib.request.urlopen(request,timeout=45) as response:html=response.read(3_000_000).decode('utf-8')
 data=parse(html)
 path=ROOT/'data/prices.json';path.parent.mkdir(exist_ok=True);temp=path.with_suffix('.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');temp.replace(path)
 print(f'Updated {len(data["items"])} products')
