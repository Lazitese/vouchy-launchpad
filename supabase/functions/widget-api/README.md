# Widget API Edge Function

This Supabase Edge Function provides public API endpoints for the embeddable testimonial widget.

## Endpoints

### GET `/widget-api/:workspaceId/settings`
Returns widget settings for a workspace.

**Response:**
```json
{
  "id": "uuid",
  "workspace_id": "uuid",
  "dark_mode": false,
  "layout": "grid",
  "show_video_first": true
}
```

### GET `/widget-api/:workspaceId/testimonials`
Returns approved testimonials for a workspace.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "video",
    "status": "approved",
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "author_title": "CEO",
    "author_company": "Acme Inc",
    "author_avatar_url": "https://...",
    "content": "Great product!",
    "video_url": "https://...",
    "rating": 5,
    "created_at": "2026-01-06T..."
  }
]
```

## CORS

All endpoints support CORS to allow embedding on any domain.

## Usage

The widget.js file automatically calls these endpoints when embedded on a website.
