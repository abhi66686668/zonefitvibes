import urllib.request
import urllib.parse
import re

queries = {
    'lying_curl': [
        'leg press machine gym',
        'leg curls gym',
        'leg exercise machine gym',
        'lying leg curl'
    ],
    'hip_thrust': [
        'glute exercise gym barbell',
        'barbell hip thrust gym',
        'hip thrust exercise'
    ],
    'seated_calf': [
        'calves exercise gym',
        'calf raise machine',
        'legs fitness man gym'
    ]
}

for name, q_list in queries.items():
    print(f'=== Results for {name} ===')
    for q in q_list:
        url = 'https://search.yahoo.com/search?p=' + urllib.parse.quote('site:pexels.com/photo/ ' + q)
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
                decoded = urllib.parse.unquote(html)
                matches = re.findall(r'pexels\.com/photo/([a-zA-Z0-9\-]+-([0-9]+))', decoded)
                if matches:
                    print(f'  Query "{q}":')
                    for full_slug, photo_id in list(dict.fromkeys(matches))[:4]:
                        print(f'    ID: {photo_id} | Slug: {full_slug}')
        except Exception as e:
            pass
