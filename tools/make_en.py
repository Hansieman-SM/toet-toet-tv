"""Maakt Engelse versies van de Nederlandse video-scripts: <naam>.js -> <naam>_en.js, alle tekst via en/translations.json.
Gebruik: python3 tools/make_en.py file1.js file2.js ...  (meldt teksten zonder vertaling)"""
import re, json, sys
T = json.load(open('en/translations.json'))
pat = re.compile(r"""(['"])((?:\\.|(?!\1).)*?)\1""")
for f in sys.argv[1:]:
    s = open(f).read(); missing = set()
    def rep(m):
        q, t = m.group(1), m.group(2)
        raw = t.replace("\\'", "'")
        if raw in T and T[raw] != raw: return json.dumps(T[raw], ensure_ascii=False)
        if re.search(r'[a-zà-ÿ]{3,} [a-zà-ÿ]{2,}', raw) and raw not in T: missing.add(raw)
        return m.group(0)
    out = pat.sub(rep, s)
    out = "process.env.TOET_LANG = 'en';\n" + out
    o = f[:-3] + '_en.js'; open(o, 'w').write(out)
    print(o, 'ONTBREEKT:' if missing else 'ok', *sorted(missing))
