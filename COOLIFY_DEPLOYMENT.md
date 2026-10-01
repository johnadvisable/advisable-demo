# Coolify Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    app (Nginx)                               │
│                    Port: 80                                  │
│                    4 CPU, 2GB RAM                            │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  React SPA      │    │  /img/ Proxy    │                 │
│  │  (Static)       │    │  to imgproxy    │                 │
│  └─────────────────┘    └─────────────────┘                 │
│           │                                                  │
│           ▼ (bots detected)                                  │
│  ┌─────────────────────────────────────────┐                │
│  │  Prerender Load Balancer (least_conn)   │                │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
          │                     │
          ▼                     ▼
┌───────────────────┐  ┌───────────────────────────────────────┐
│     imgproxy      │  │        Prerender Cluster              │
│     Port: 8080    │  │                                       │
│     4 CPU, 2GB    │  │  ┌──────────┐ ┌──────────┐ ┌────────┐│
│                   │  │  │prerender1│ │prerender2│ │prerender3│
│  WebP/AVIF        │  │  │ :3000    │ │ :3000    │ │ :3000  ││
│  On-the-fly       │  │  └────┬─────┘ └────┬─────┘ └───┬────┘│
│  resize           │  │       │            │           │     │
└───────────────────┘  │       └────────────┴───────────┘     │
                       │                    │                  │
                       │                    ▼                  │
                       │  ┌─────────────────────────────────┐ │
                       │  │           Redis                  │ │
                       │  │        (Cache Store)             │ │
                       │  │     512MB, LRU eviction          │ │
                       │  └─────────────────────────────────┘ │
                       └───────────────────────────────────────┘
```

## Prerender Configuration

### Bot Detection

The following bots are automatically detected and served prerendered content:

**Search Engines:**
- Googlebot, Google-InspectionTool, GoogleOther, Google-Extended
- Bingbot, MSNbot
- Yandexbot, Baiduspider, DuckDuckBot, Applebot

**Social Media:**
- Facebookexternalhit, Twitterbot, LinkedInbot
- Pinterest, Slackbot, WhatsApp, Telegrambot, Discordbot

**SEO Tools:**
- Semrushbot, Ahrefsbot, MJ12bot, Dotbot
- Screaming Frog, SEOkicks, Sistrix, Seobility
- Serpstatbot, DataForSEO, Megaindex

**AI Bots:**
- GPTBot, ChatGPT-User, ClaudeBot, Anthropic-AI
- Cohere-AI, PerplexityBot, YouBot, CCBot

### Domain-Specific Caching

Each domain gets its own cache key:
- `advisable.com` → English cache
- `advisable.gr` → Greek cache  
- `advisable.es` → Spanish cache
- `advisable.fr` → French cache
- `advisable.it` → Italian cache
- `advisable.de` → German cache

The prerender URL includes the full host: `https://$host$request_uri`

### Redis Cache Settings

- **TTL:** 24 hours (86400 seconds)
- **Max Size:** 1000 entries per instance
- **Memory:** 512MB with LRU eviction
- **Persistence:** Disabled (cache only)

## What needs a rebuild vs what is instant

The live site (`www.advisable.com`) is served by this Coolify stack, **not** by Lovable hosting. That means:

| Change type | Goes live |
| --- | --- |
| Database content (insights, news, services, clients, team, translations stored in Supabase) | Instantly - the containers read the same Supabase project |
| Supabase Edge Functions | Instantly on deploy to Supabase |
| Frontend code (`src/**`), static locale JSON (`public/locales/**`), images in `public/**`, nginx config | Only after Coolify pulls the commit and **rebuilds** |

Clicking "Publish" in Lovable updates only the `*.lovable.app` deployment. It cannot trigger a Coolify redeploy.

## Auto-deploy on push

Goal: every commit pushed to the default branch triggers a Coolify rebuild automatically.

### Option A - Coolify native GitHub App (recommended)

1. Coolify -> the `advisable` application -> **Source**: confirm the repository and branch match the branch Lovable commits to (usually `main`).
2. Enable **Automatic Deployment** ("Auto deploy on push") in the application settings.
3. If the source is connected through the Coolify GitHub App, the webhook is registered automatically - nothing to do on GitHub.
4. If the source uses a deploy key instead, copy the **Deployment Webhook URL** from Coolify and add it in GitHub -> repo -> Settings -> Webhooks with content type `application/json` and the `push` event.

### Option B - GitHub Actions trigger

Use this only if you prefer GitHub to drive the deployment. The workflow lives at `.github/workflows/coolify-deploy.yml` and just calls the Coolify deploy webhook (the build itself still runs in Coolify from the existing `Dockerfile`).

1. Copy the **Deployment Webhook URL** from the Coolify application.
2. GitHub -> repo -> Settings -> Secrets and variables -> Actions:
   - `COOLIFY_DEPLOY_WEBHOOK` = the webhook URL
   - `COOLIFY_TOKEN` = a Coolify API token (only if your instance requires bearer auth on the webhook)
3. Push to `main`, or run the workflow manually via **Actions -> Trigger Coolify Deploy -> Run workflow**.

If the secret is not set, the workflow exits successfully without doing anything, so it is safe to leave in place while using Option A.

### Verifying a deploy landed

```bash
# Should contain the newest strings after a successful rebuild
curl -s https://www.advisable.com/locales/front/termsofservice/en.json | grep -c "Venture Studio Submissions"
```

## Cache invalidation after a deploy

A finished rebuild is not always enough - both Cloudflare and the prerender cache can keep serving the previous version:

1. **Cloudflare**: Dashboard -> Caching -> Configuration -> **Purge Everything** (or purge the specific URLs / `/locales/*` paths).
2. **Prerender**: bots are served from the prerender cache (`CACHE_TTL` in `docker-compose*.yml`). Restarting the prerender container clears its memory cache:
   ```bash
   docker restart prerender1
   ```
   For the Redis-backed setup: `docker exec redis redis-cli flushall`
3. **Browser check**: verify with a hard reload or `curl` (see above) rather than a normal page load, to avoid local cache.

## Deployment Steps


### 1. Create Coolify Project

1. Log in to your Coolify dashboard
2. Create a new Project
3. Add a new "Docker Compose" resource

### 2. Configure Services

Upload or paste the content of `docker-compose.coolify.yml`

### 3. Set Environment Variables

In Coolify, set the following environment variables:

```bash
# Optional - already in code
VITE_SUPABASE_URL=https://difvvdmelbtjxxvpjuvw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

### 4. Configure Domain

1. Go to the `app` service settings
2. Add your domain (e.g., `advisable.com`)
3. Enable HTTPS (Coolify handles Let's Encrypt)

### 5. Deploy

Click "Deploy" and wait for all services to start.

## Service Details

### app (Nginx)
- **Purpose**: Serves React SPA with static file serving
- **Features**: GZIP compression, security headers, domain-based language routing
- **Prerender**: Routes bot traffic to prerender cluster

### Prerender Cluster (prerender1-3)
- **Image**: `tvanro/prerender-alpine:6.6.1`
- **Purpose**: Server-side rendering for SEO bots
- **Load Balancing**: Nginx least_conn strategy
- **Cache Backend**: Redis

### Redis
- **Purpose**: Shared cache for all prerender instances
- **Memory**: 512MB with LRU eviction
- **Data**: Not persisted (cache-only mode)

### imgproxy
- **Purpose**: On-the-fly image optimization
- **Features**: WebP/AVIF conversion, resizing
- **Sources**: Local files + Supabase storage

## API Endpoints

### Image Proxy

```bash
# Resize image to 300x200
/img/rs:fit:300:200/plain/local:///images/photo.jpg

# Convert to WebP with quality 80
/img/q:80/plain/local:///images/photo.png

# Resize and crop from center
/img/rs:fill:400:400/g:ce/plain/local:///images/photo.jpg
```

## Monitoring

### Check Nginx Access Logs
```bash
docker-compose logs -f app
```

### Check Prerender Status
```bash
# Health check all instances
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

### Check Redis Status
```bash
docker exec -it redis redis-cli info stats
docker exec -it redis redis-cli dbsize
```

### Test Prerender Manually
```bash
# Test Greek domain
curl -I "http://localhost:3001/https://www.advisable.gr/"

# Test English domain  
curl -I "http://localhost:3001/https://www.advisable.com/"
```

## Troubleshooting

### Prerender Not Working
1. Verify all 3 prerender instances are healthy
2. Check Redis connectivity: `docker exec redis redis-cli ping`
3. Review prerender logs: `docker-compose logs prerender1`

### Images Not Optimizing
1. Verify imgproxy is running
2. Check that images exist in `/public` directory
3. Test direct access: `curl http://localhost:8082/health`

### SPA Routes Not Working
1. Verify nginx fallback is configured correctly
2. Check that index.html exists in /usr/share/nginx/html
3. Review nginx error logs

### Cache Not Working
1. Check Redis memory: `docker exec redis redis-cli info memory`
2. Verify TTL settings: `docker exec redis redis-cli ttl <key>`
3. Clear cache if needed: `docker exec redis redis-cli flushall`

## Performance Tips

1. **Bot Response Time**: Prerendered pages are cached for 24h, first request may be slow
2. **Image optimization**: Use imgproxy URLs in React components for automatic WebP
3. **Static assets**: Leverage browser caching with immutable headers for hashed assets
4. **GZIP compression**: Enabled by default for text-based assets

## Warming the Cache

To pre-warm the cache for important pages:

```bash
# Warm Greek homepage
curl -A "Googlebot" https://www.advisable.gr/

# Warm all service pages
for slug in digital-marketing web-development seo-services; do
  curl -A "Googlebot" "https://www.advisable.gr/$slug"
  curl -A "Googlebot" "https://www.advisable.com/$slug"
done
```
