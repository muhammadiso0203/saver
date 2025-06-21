import sys
from yt_dlp import YoutubeDL

url = sys.argv[1]

options = {
    'outtmpl': 'downloads/youtube/video.%(ext)s',
    'format': 'mp4[height<=480]',
}

with YoutubeDL(options) as ydl:
    try:
        ydl.download([url])
        print("✅ YouTube video yuklandi")
    except Exception as e:
        print("❌ Xatolik:", e)
