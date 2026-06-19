# AI Tools Dashboard — AI

> **Module:** Website · **Screen:** AI Tools · **Route:** `/website/ai` · **Status:** Draft

## Purpose
Central launcher for all Website AI tools — content generation, SEO, images, and translation.

## Layout
Tool card grid + credit usage sidebar. Tool opens in modal or side panel.

## Tool Cards

| Tool | Icon | Credits | Description |
|------|------|---------|-------------|
| Page Writer | ✍️ | 2/run | Generate page section copy |
| Blog Writer | 📝 | 5/run | Draft full blog post |
| Image Generator | 🎨 | 5/image | Create AI images for pages |
| SEO Generator | 🔍 | 1/page | Bulk meta tag generation |
| Translator | 🌐 | 10/page | Translate page to another language |

## Credit Usage Sidebar
- Credits used this month
- Credits remaining
- Usage history (last 10 actions)
- Upgrade plan button (if credits low)

## Page Writer Tool (Modal)
- Input: Target page, section type, tone (professional/friendly/formal)
- Output: Generated copy with "Insert into page" button
- Regenerate option

## Blog Writer Tool (Modal)
- Input: Title, outline (bullet points), target audience, tone
- Output: Full draft → opens in blog editor
- AI draft saved as `draft` status

## Actions
- **View AI History** → log of all AI generations for this company
