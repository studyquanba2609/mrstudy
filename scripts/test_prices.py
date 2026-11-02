import unittest
from update_prices import markup_for,parse

class PricingRules(unittest.TestCase):
 def test_device_prices(self):
  for name in ['iPhone 17 Pro Max 256G','iPad Pro 11 M5','MacBook Air M5','Ultra 3 49mm']:
   with self.subTest(name=name):self.assertEqual(markup_for(name),700_000)
 def test_airpods_charger_word_is_not_a_charger(self):
  for name in ['AirPods 5 (SẠC THƯỜNG)', 'AirPods 5 wireless charge', 'AirPods Pro 3','Tai nghe Bluetooth']:
   with self.subTest(name=name):self.assertEqual(markup_for(name),400_000)
 def test_wired_accessories(self):
  for name in ['Củ sạc Apple 20W Fullbox','Cáp USB-C 1m','Tai nghe Apple EarPods Lightning','Tai nghe có dây','CÁP SẠC Lightning']:
   with self.subTest(name=name):self.assertEqual(markup_for(name),100_000)
 def test_import_applies_once_and_preserves_sold_out(self):
  rows=''.join(f'<tr><td>iPhone {i}</td><td>10.000.000</td><td>New</td></tr>' for i in range(20))
  rows+='<tr><td>AirPods 5 (SẠC THƯỜNG)</td><td>3.350.000</td><td>New</td></tr><tr><td>Củ sạc Apple 20W</td><td>280.000</td><td>New</td></tr><tr><td>EarPods</td><td>HẾT RỒI</td><td>New</td></tr>'
  data=parse('<table>'+rows+'</table>')['items']
  self.assertEqual(data[0]['price'],10_700_000)
  self.assertEqual(data[-3]['price'],3_750_000)
  self.assertEqual(data[-2]['price'],380_000)
  self.assertIsNone(data[-1]['price'])
  self.assertEqual(data,parse('<table>'+rows+'</table>')['items'])
 def test_invalid_source_is_rejected(self):
  with self.assertRaises(ValueError):parse('<html>Unavailable</html>')

if __name__=='__main__':unittest.main()
