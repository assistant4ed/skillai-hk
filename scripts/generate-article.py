#!/usr/bin/env python3
"""
SkillAI.hk Article Generator
Takes search results and generates full articles with content blocks.
Uses OpenRouter API to generate article content in Cantonese.
"""
import json, os, sys, hashlib
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
ARTICLES_DIR = os.path.join(DATA_DIR, "articles")
os.makedirs(ARTICLES_DIR, exist_ok=True)

def get_openrouter_key():
    """Read OpenRouter API key from openclaw config."""
    try:
        with open(os.path.expanduser("~/.openclaw/openclaw.json")) as f:
            config = json.load(f)
        # models.providers.openrouter.apiKey
        providers = config.get("models", {}).get("providers", {})
        for name, p in providers.items():
            if "openrouter" in name.lower() or "openrouter" in str(p.get("baseUrl", "")).lower():
                return p.get("apiKey", "")
        # Try env
        return os.environ.get("OPENROUTER_API_KEY", "")
    except:
        return os.environ.get("OPENROUTER_API_KEY", "")

def generate_article_content(title, excerpt, article_type, tags, source_url=""):
    """Use OpenRouter to generate full article content in JSON block format."""
    api_key = get_openrouter_key()
    if not api_key:
        print("No OpenRouter API key found", file=sys.stderr)
        return None

    import urllib.request

    prompt = f"""你係 SkillAI.hk 嘅 AI 編輯。用廣東話書面語寫一篇完整文章。

標題：{title}
摘要：{excerpt}
類型：{article_type}
標籤：{', '.join(tags)}
{f'參考來源：{source_url}' if source_url else ''}

要求：
1. 用 JSON array 格式輸出 content blocks
2. 每篇 1500-2500 字
3. 語氣：專業但親切，用廣東話口語書面化
4. 必須包含具體例子、數據、實用建議

支援的 block types：
- {{"type":"heading","text":"..."}} — 大標題
- {{"type":"subheading","text":"..."}} — 小標題  
- {{"type":"paragraph","text":"..."}} — 段落
- {{"type":"list","items":["...","..."]}} — 列表
- {{"type":"code","language":"...","code":"..."}} — 代碼
- {{"type":"quote","text":"...","author":"..."}} — 引用
- {{"type":"cta","text":"...","link":"/courses"}} — 行動號召

只輸出 JSON array，不要其他文字。以 [ 開頭，] 結尾。"""

    body = json.dumps({
        "model": "google/gemini-2.0-flash-001",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4000,
        "temperature": 0.7,
    }).encode()

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://skillai.hk",
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]
            # Extract JSON from response
            text = text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0]
            content = json.loads(text)
            return content
    except Exception as e:
        print(f"API error: {e}", file=sys.stderr)
        return None

def generate_and_save(post_data):
    """Generate full article and save to articles directory."""
    article_id = post_data["id"]
    article_path = os.path.join(ARTICLES_DIR, f"{article_id}.json")

    # Skip if already exists
    if os.path.exists(article_path):
        return False

    print(f"  Generating article: {post_data['title'][:40]}...")
    content = generate_article_content(
        title=post_data["title"],
        excerpt=post_data["excerpt"],
        article_type=post_data["type"],
        tags=post_data.get("tags", []),
        source_url=post_data.get("sourceUrl", ""),
    )

    if not content:
        print(f"  ⚠️ Failed to generate content for {article_id}", file=sys.stderr)
        return False

    article = {
        **post_data,
        "heroImage": "/mascot-hero.jpg",
        "content": content,
        "generatedAt": datetime.now().isoformat(),
    }

    with open(article_path, "w") as f:
        json.dump(article, f, indent=2, ensure_ascii=False)

    print(f"  ✅ Saved: {article_path}")
    return True

def main():
    """Generate articles for all posts in posts.json that don't have article files yet."""
    posts_file = os.path.join(DATA_DIR, "posts.json")
    if not os.path.exists(posts_file):
        print("No posts.json found")
        return 0

    with open(posts_file) as f:
        data = json.load(f)

    generated = 0
    for post in data.get("posts", []):
        if post.get("auto"):
            # Generate full articles for auto-fetched posts
            if generate_and_save(post):
                generated += 1
                # Update post to mark as having article page
                post["hasArticle"] = True

    # Save updated posts
    with open(posts_file, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nGenerated {generated} new articles")
    return generated

if __name__ == "__main__":
    count = main()
    print(f"Done: {count} articles generated")
