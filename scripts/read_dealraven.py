"""Read only new DealRaven posts; emit candidates for editorial verification."""
import os, re, json, asyncio
from datetime import datetime, timezone, timedelta
from telethon import TelegramClient
from telethon.sessions import StringSession

async def main():
    client = TelegramClient(StringSession(os.environ["TG_SESSION"]), int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"])
    async with client:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        rows = []
        async for msg in client.iter_messages("DealRaven", limit=200):
            if msg.date < cutoff:
                break
            body = msg.raw_text or ""
            urls = re.findall(r'https://apps\.apple\.com/[^\s<>]+', body)
            for entity in msg.entities or []:
                url = getattr(entity, "url", "")
                if url.startswith("https://apps.apple.com/"):
                    urls.append(url)
            for row in msg.buttons or []:
                for button in row:
                    url = getattr(button, "url", "") or ""
                    if url.startswith("https://apps.apple.com/"):
                        urls.append(url)
            if urls:
                rows.append({"sourceUrl": f"https://t.me/DealRaven/{msg.id}", "postedAt": msg.date.isoformat(), "appUrls": sorted(set(urls)), "text": body})
        print(json.dumps(rows, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
