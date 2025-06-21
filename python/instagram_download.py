import sys
import instaloader

url = sys.argv[1]
shortcode = url.split("/")[-2]

loader = instaloader.Instaloader(
    dirname_pattern="downloads/video",
    save_metadata=False,
    post_metadata_txt_pattern="",
)

try:
    post = instaloader.Post.from_shortcode(loader.context, shortcode)
    loader.download_post(post, target="video")
    print("✅ Yuklandi")
except Exception as e:
    print("❌ Xatolik:", e)
