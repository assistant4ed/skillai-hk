#!/usr/bin/env python3
"""
SkillAI.hk Content Auto-Updater
每日自動搜索 AI 新聞、教學、工具評測
生成 JSON data file 供 Next.js 頁面讀取
"""
import json, os, subprocess, sys, hashlib
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
POSTS_FILE = os.path.join(DATA_DIR, "posts.json")

os.makedirs(DATA_DIR, exist_ok=True)

def search_web(query, count=5):
    """Use brave search via curl."""
    try:
        api_key = os.environ.get("BRAVE_API_KEY", "")
        if not api_key:
            # Read from openclaw config
            with open(os.path.expanduser("~/.openclaw/openclaw.json")) as f:
                config = json.load(f)
            api_key = config.get("tools", {}).get("web", {}).get("search", {}).get("apiKey", "")

        if not api_key:
            return []

        import urllib.request, urllib.parse
        url = f"https://api.search.brave.com/res/v1/web/search?q={urllib.parse.quote(query)}&count={count}"
        req = urllib.request.Request(url, headers={"X-Subscription-Token": api_key, "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
            results = []
            for r in data.get("web", {}).get("results", [])[:count]:
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "snippet": r.get("description", ""),
                })
            return results
    except Exception as e:
        print(f"Search error: {e}", file=sys.stderr)
        return []

def generate_posts():
    """Search for latest AI content and generate posts."""
    today = datetime.now().strftime("%Y-%m-%d")
    posts = []

    # Category 1: AI News (Chinese)
    news = search_web("AI 人工智能 最新消息 2026", 5)
    for i, item in enumerate(news[:3]):
        post_id = hashlib.md5(item["url"].encode()).hexdigest()[:12]
        posts.append({
            "id": f"news-{post_id}",
            "title": item["title"],
            "excerpt": item["snippet"][:150],
            "type": "news",
            "date": today,
            "tags": ["AI 新聞", "2026"],
            "sourceUrl": item["url"],
            "auto": True,
        })

    # Category 2: AI Tools & Tutorials
    tools = search_web("AI tools tutorial beginner 2026", 5)
    for i, item in enumerate(tools[:2]):
        post_id = hashlib.md5(item["url"].encode()).hexdigest()[:12]
        posts.append({
            "id": f"tool-{post_id}",
            "title": item["title"],
            "excerpt": item["snippet"][:150],
            "type": "article",
            "date": today,
            "readTime": "5 分鐘",
            "tags": ["AI 工具", "教學"],
            "sourceUrl": item["url"],
            "auto": True,
        })

    # Category 3: Prompt Engineering Tips
    tips = search_web("prompt engineering tips tricks ChatGPT Claude 2026", 3)
    for item in tips[:1]:
        post_id = hashlib.md5(item["url"].encode()).hexdigest()[:12]
        posts.append({
            "id": f"tip-{post_id}",
            "title": item["title"],
            "excerpt": item["snippet"][:150],
            "type": "tip",
            "date": today,
            "readTime": "3 分鐘",
            "tags": ["Prompt Engineering", "實用技巧"],
            "sourceUrl": item["url"],
            "auto": True,
        })

    # Category 4: AI Video content
    videos = search_web("AI tutorial video YouTube 教學 2026", 3)
    for item in videos[:1]:
        post_id = hashlib.md5(item["url"].encode()).hexdigest()[:12]
        posts.append({
            "id": f"video-{post_id}",
            "title": item["title"],
            "excerpt": item["snippet"][:150],
            "type": "video",
            "date": today,
            "tags": ["影片", "教學"],
            "sourceUrl": item["url"],
            "auto": True,
        })

    return posts

def load_existing():
    """Load existing posts."""
    try:
        with open(POSTS_FILE) as f:
            return json.load(f)
    except:
        return {"posts": [], "lastUpdated": None, "curated": []}

def save_posts(data):
    """Save posts data."""
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    print(f"Updating SkillAI.hk content at {datetime.now()}")

    data = load_existing()

    # Generate new posts
    new_posts = generate_posts()
    print(f"Found {len(new_posts)} new items")

    # Merge: keep curated (manual) posts, add new auto posts
    # Remove auto posts older than 7 days
    week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    existing_auto = [p for p in data.get("posts", []) if p.get("auto") and p["date"] >= week_ago]
    curated = data.get("curated", [])

    # Deduplicate by id
    seen = set()
    all_posts = []
    for p in curated + new_posts + existing_auto:
        if p["id"] not in seen:
            seen.add(p["id"])
            all_posts.append(p)

    # Sort by date desc
    all_posts.sort(key=lambda p: p["date"], reverse=True)

    data["posts"] = all_posts
    data["lastUpdated"] = datetime.now().isoformat()
    data["curated"] = curated

    save_posts(data)
    print(f"Saved {len(all_posts)} total posts ({len(curated)} curated + {len(new_posts)} new)")

    return len(new_posts)

if __name__ == "__main__":
    count = main()
    print(f"Done: {count} new posts generated")
