import urllib.request
import urllib.parse
import json
import re

tracks = [
    {"artist": "Barasuara", "title": "Terbuang Dalam Waktu", "url": "assets/Barasuara - Terbuang Dalam Waktu (Official Video).mp3"},
    {"artist": "Bon Jovi", "title": "Bed Of Roses", "url": "assets/Bed Of Roses.mp3"},
    {"artist": "Iqbaal Ramadhan", "title": "Rindu Sendiri", "url": "assets/Rindu Sendiri.mp3"},
    {"artist": "Sal Priadi", "title": "Kita usahakan rumah itu", "url": "assets/Sal Priadi - Kita usahakan rumah itu (Official Lyric Video).mp3"},
    {"artist": "Dewa 19", "title": "Aku Disini Untukmu", "url": "assets/Aku Disini Untukmu.mp3"},
    {"artist": "Sidney Gish", "title": "Impostor Syndrome", "url": "assets/Impostor Syndrome-1.mp3"},
    {"artist": "Gie", "title": "Tetaplah Di Sini", "url": "assets/Tetaplah di Sini.mp3"}
]

def parse_time(time_str):
    # Parses mm:ss.xx into float/int seconds
    parts = time_str.split(':')
    minutes = int(parts[0])
    seconds = float(parts[1])
    return int(minutes * 60 + seconds)

result_playlist = []

for track in tracks:
    query = f"{track['artist']} {track['title']}"
    url = f"https://lrclib.net/api/search?q={urllib.parse.quote(query)}"
    print(f"Fetching: {query}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            # Find best match with synced lyrics
            match = None
            for item in data:
                if item.get('syncedLyrics'):
                    match = item
                    break
            
            if not match and data:
                match = data[0]
                
            lyrics_list = []
            if match and match.get('syncedLyrics'):
                synced = match['syncedLyrics']
                for line in synced.split('\n'):
                    line = line.strip()
                    if not line:
                        continue
                    m = re.match(r'^\[(\d+:\d+\.\d+)\]\s*(.*)$', line)
                    if m:
                        t_str, text = m.groups()
                        t_sec = parse_time(t_str)
                        text = text.strip()
                        # Clean up empty lines or instrumental notations
                        if text and not text.startswith('♪') and not text.lower() == 'instrumental':
                            lyrics_list.append({"time": t_sec, "text": text})
            
            # Fallback if no synced lyrics found
            if not lyrics_list:
                print(f"  Warning: No synced lyrics for {query}, using dummy progressive times.")
                lyrics_list = [{"time": 0, "text": f"[Lirik {track['title']} belum tersinkronisasi]"}]
                
            result_playlist.append({
                "title": track['title'],
                "sub": track['artist'],
                "url": track['url'],
                "lyrics": lyrics_list
            })
    except Exception as e:
        print(f"  Error fetching {query}: {e}")
        result_playlist.append({
            "title": track['title'],
            "sub": track['artist'],
            "url": track['url'],
            "lyrics": [{"time": 0, "text": f"Error loading lyrics: {e}"}]
        })

# Write the JS output to a temporary file
output_path = "C:\\Users\\ACER\\.gemini\\antigravity\\scratch\\website-memori\\playlist_synced.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result_playlist, f, indent=2, ensure_ascii=False)

print(f"\nDone! Playlist saved to {output_path}")
