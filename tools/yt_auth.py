"""One-time helper (run on your own computer): gets the YouTube refresh token for the nightly GitHub workflow
(playlists + English language settings). Needs only Python 3, no extra packages.
  python3 tools/yt_auth.py <CLIENT_ID> <CLIENT_SECRET>
A browser opens: log in with the Google account of the Toet Toet and Friends channel and allow access.
The script then prints the three values to paste into GitHub (Settings > Secrets and variables > Actions > New repository secret):
YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN."""
import sys, json, urllib.parse, urllib.request, webbrowser, http.server
CID, SEC = sys.argv[1], sys.argv[2]; PORT = 8765; REDIR = f'http://localhost:{PORT}'
url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode({'client_id': CID, 'redirect_uri': REDIR, 'response_type': 'code',
      'scope': 'https://www.googleapis.com/auth/youtube', 'access_type': 'offline', 'prompt': 'consent'})
code = {}
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query); code['c'] = q.get('code', [''])[0]
        self.send_response(200); self.end_headers(); self.wfile.write('Klaar! Je kunt dit venster sluiten.'.encode())
    def log_message(self, *a): pass
print('Browser opent… zo niet, open deze link zelf:\n' + url); webbrowser.open(url)
http.server.HTTPServer(('localhost', PORT), H).handle_request()
tok = json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', urllib.parse.urlencode({'code': code['c'], 'client_id': CID,
      'client_secret': SEC, 'redirect_uri': REDIR, 'grant_type': 'authorization_code'}).encode()))
print('\nZet deze drie als GitHub-secrets:\nYT_CLIENT_ID =', CID, '\nYT_CLIENT_SECRET =', SEC, '\nYT_REFRESH_TOKEN =', tok['refresh_token'])
