"""Sorts the channel's long-form videos into YouTube playlists automatically (rules in tools/playlists.json).
Runs daily in GitHub Actions. Needs repository secrets YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (OAuth, scope youtube).
Creates missing playlists (public), adds each new video once. Never deletes or edits videos. Without secrets it exits quietly."""
import json, os, sys, urllib.request, urllib.parse

CID, SEC, RT = (os.environ.get(k, '') for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'))
if not (CID and SEC and RT):
    print('No YouTube secrets set – skipping playlist sorting.'); sys.exit(0)
DRY = os.environ.get('DRY') == '1'
API = 'https://www.googleapis.com/youtube/v3/'

def token():
    data = urllib.parse.urlencode({'client_id': CID, 'client_secret': SEC, 'refresh_token': RT, 'grant_type': 'refresh_token'}).encode()
    return json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', data))['access_token']
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
