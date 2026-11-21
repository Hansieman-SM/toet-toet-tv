"""Sorts the channel's long-form videos into YouTube playlists automatically (rules in tools/playlists.json).
Runs daily in GitHub Actions. Needs repository secrets YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (OAuth, scope youtube).
Creates missing playlists (public), adds each new video once. Never deletes videos. Without secrets it FAILS on purpose, so the daily check notices it.
Also (Hans, 2026-11-21): sets the language settings that Metricool cannot send – video language + title/description language = English
(snippet.defaultAudioLanguage / defaultLanguage) and 'no paid promotion' – on every NEW video (published since LANG_SINCE, default
2026-11-21; older videos, incl. the Dutch ones, are never touched). Only those fields change; title, description, tags, category and
made-for-kids stay exactly as they are. (Caption certification has no API field – it is optional and not needed for our videos.)"""
import json, os, sys, urllib.request, urllib.parse, urllib.error

CID, SEC, RT = (os.environ.get(k, '').strip() for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'))
if not (CID and SEC and RT):
    print('ERROR: YouTube secrets YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN are not set – nothing sorted (see tools/yt_auth.py).'); sys.exit(1)
DRY = os.environ.get('DRY') == '1'
API = 'https://www.googleapis.com/youtube/v3/'

def token():
    data = urllib.parse.urlencode({'client_id': CID, 'client_secret': SEC, 'refresh_token': RT, 'grant_type': 'refresh_token'}).encode()
    try: return json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', data))['access_token']
    except urllib.error.HTTPError as e:
        print('ERROR getting a Google access token:', e.code, e.read().decode()[:300]); sys.exit(1)
TOK = token()

def call(method, path, params=None, body=None):
    url = API + path + ('?' + urllib.parse.urlencode(params) if params else '')
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'Bearer ' + TOK, 'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req))

def pages(path, params):
    out, tok = [], None
    while True:
        p = dict(params, maxResults=50, **({'pageToken': tok} if tok else {}))
        r = call('GET', path, p); out += r.get('items', []); tok = r.get('nextPageToken')
        if not tok: return out

rules = json.load(open(os.path.join(os.path.dirname(__file__), 'playlists.json')))['playlists']
uploads = call('GET', 'channels', {'part': 'contentDetails', 'mine': 'true'})['items'][0]['contentDetails']['relatedPlaylists']['uploads']
videos = [(i['contentDetails']['videoId'], i['snippet']['title']) for i in pages('playlistItems', {'part': 'snippet,contentDetails', 'playlistId': uploads})]
mine = {p['snippet']['title']: p['id'] for p in pages('playlists', {'part': 'snippet', 'mine': 'true'})}

def match(rule, title):
    t = title.lower()
    return all(w in t for w in rule.get('all', [])) and (not rule.get('any') or any(w in t for w in rule['any'])) and not any(w in t for w in rule.get('not', []))

added = 0; members = {}
for vid, title in videos:
    if '#shorts' in title.lower() or title in ('Private video', 'Deleted video'): continue
    rule = next((r for r in rules if match(r, title)), None)
    if not rule: continue
    name = rule['title']
    if name not in mine:
        print('create playlist:', name)
        if not DRY:
            mine[name] = call('POST', 'playlists', {'part': 'snippet,status'},
                              {'snippet': {'title': name, 'description': rule.get('description', '')}, 'status': {'privacyStatus': 'public'}})['id']
        else: mine[name] = 'DRY'
    pid = mine[name]
    if pid not in members:
        members[pid] = set() if pid == 'DRY' else {i['contentDetails']['videoId'] for i in pages('playlistItems', {'part': 'contentDetails', 'playlistId': pid})}
    if vid in members[pid]: continue
    print(f'add: {title}  ->  {name}')
    if not DRY:
        call('POST', 'playlistItems', {'part': 'snippet'}, {'snippet': {'playlistId': pid, 'resourceId': {'kind': 'youtube#video', 'videoId': vid}}})
    members[pid].add(vid); added += 1
print(f'done – {added} video(s) added to playlists')

# ---- language settings for new videos ----
SINCE = os.environ.get('LANG_SINCE', '2026-11-21T00:00:00Z')
ids = [i['contentDetails']['videoId'] for i in pages('playlistItems', {'part': 'contentDetails', 'playlistId': uploads})
       if (i['contentDetails'].get('videoPublishedAt') or '') >= SINCE]
fixed = 0
for k in range(0, len(ids), 50):
    for v in call('GET', 'videos', {'part': 'snippet,paidProductPlacementDetails', 'id': ','.join(ids[k:k + 50])}).get('items', []):
        sn = v['snippet']
        if sn.get('defaultLanguage') != 'en' or sn.get('defaultAudioLanguage') != 'en':
            body = {'id': v['id'], 'snippet': {key: sn[key] for key in ('title', 'description', 'categoryId', 'tags') if key in sn}}
            body['snippet'].update(defaultLanguage='en', defaultAudioLanguage='en')
            print('language -> English:', sn['title'])
            if not DRY: call('PUT', 'videos', {'part': 'snippet'}, body)
            fixed += 1
        if (v.get('paidProductPlacementDetails') or {}).get('hasPaidProductPlacement'):
            print('paid promotion -> no:', sn['title'])
            if not DRY: call('PUT', 'videos', {'part': 'paidProductPlacementDetails'}, {'id': v['id'], 'paidProductPlacementDetails': {'hasPaidProductPlacement': False}})
print(f'done – language set on {fixed} new video(s)')
