# 🎬 TMDB-Powered Movie Platform

A production-oriented movie application built with Next.js App Router, MongoDB, Redis, and TMDB.

This is not a demo clone.
It is structured as a layered system with clear ownership boundaries between:

User data (MongoDB)

External content (TMDB)

Caching (Redis)

HTTP layer (Next.js API routes)

# 🚀 Tech Stack

Next.js (App Router)

TypeScript

MongoDB (Mongoose)

Redis (Cloud, TLS-enabled)

JWT Authentication

Access token

Refresh token (rotation-ready)

TMDB API integration

Cursor-based pagination

# 🧠 Architectural Philosophy

The system follows strict layering:

API Layer (app/api)

Thin HTTP handlers

No business logic

Service Layer (server/)

Business logic

Data composition

External API abstraction

Data Layer

MongoDB for user-owned data

Redis for caching

TMDB for external content

Key Design Decisions

TMDB responses are normalized immediately.

Movie metadata is cache-first (Redis).

User feeds (e.g., continue watching) are composed dynamically.

No premature denormalization.

Cursor pagination for stable user data.

Clear separation between user state and external content.

# 🧩 Core Features Implemented
## 🔐 Authentication

JWT-based authentication

Access + refresh token strategy

Middleware-protected routes

## 🎥 TMDB Integration

Content lookup is handled via a cache-first primitive:

getMovieById(tmdbId)


Behavior:

Checks Redis first

Falls back to TMDB

Normalizes response

Caches for 24h

This prevents rate-limit abuse and centralizes content logic.

## ⏯ Continue Watching

Stored in MongoDB (user-owned data)

Cursor-based pagination

Hydrated with TMDB metadata via service layer

No direct joins

Movie data reused via cache

## ⚡ Redis Usage

Redis is used for:

TMDB movie metadata caching

Rate limiting

(Optional) short-lived feed caching

Caching is applied only at stable boundaries.

## 🏗 Project Structure
app/
 ├─ api/                  # Thin HTTP layer
 └─ (frontend UI)

server/
 ├─ auth/                 # JWT logic
 ├─ users/                # User domain
 ├─ watch/                # Watch history domain
 ├─ tmdb/                 # TMDB client + normalization
 ├─ cache/                # Redis abstraction
 ├─ db/                   # Mongo connection
 ├─ rate-limit/           # Rate limiting logic
 └─ config/               # Environment handling

middleware.ts             # Auth middleware
docs/domain.md            # Domain modeling

## 🗄 Data Ownership Model
MongoDB owns:

Users

Watch history

Progress

Status

User-specific state

TMDB owns:

Movie metadata

Ratings

Popularity

Redis owns:

Cached movie metadata

Rate limiting state

This prevents accidental coupling and schema drift.

## 🏃 Getting Started

Install dependencies:

npm install


Run development server:

npm run dev


Open:

http://localhost:3000

# 🔐 Environment Variables

You will need:

MONGODB_URI=
REDIS_URL=
REDIS_PASSWORD=
TMDB_API_KEY=
JWT_SECRET=

# 📈 What’s Next

Planned evolutions:

Minimal movie denormalization

Background refresh jobs

Event-driven architecture for user actions

Recommendation primitives

Analytics layer

# 🧭 Development Principles

Normalize at boundaries

Cache stable primitives

Avoid premature optimization

Keep API layer thin

Prefer composition over coupling

Make tradeoffs explicit