# Vouchy - Testimonial Collection Platform

## Overview

Vouchy is a modern, full-stack testimonial collection and management platform built with React, TypeScript, and Supabase. It enables businesses to collect, manage, and showcase video and text testimonials with beautiful embeddable widgets.

## Features

### 🎥 Testimonial Collection
- **Video Testimonials**: Record directly in browser using MediaRecorder API
- **Text Testimonials**: Simple form with rich metadata
- **Star Ratings**: 1-5 star rating system for all testimonials
- **Photo Upload**: Customers can upload their photo/avatar
- **Custom Questions**: Configurable questions per collection space

### 📊 Dashboard
- **Space Management**: Create multiple collection spaces for different products/services
- **Testimonial Moderation**: Approve, reject, or delete testimonials
- **Analytics**: Track total, approved, and pending testimonials
- **Wall of Love**: Curated display of approved testimonials

### 🎨 Widget Lab
- **5 Widget Styles**:
  - Minimal - Clean & subtle
  - Cards - Modern card layout
  - Masonry - Pinterest-style grid
  - Marquee - Auto-scrolling testimonials
  - Spotlight - Featured carousel
- **Dark/Light Mode**: Toggle between themes
- **Layout Options**: Grid or list layouts
- **Video Priority**: Option to show video testimonials first
- **Pro Badges**: Visual indicator for premium widget styles

### 🔐 Authentication
- Email/Password authentication
- Auto-confirm enabled for seamless signup
- Protected routes for dashboard access
- Persistent sessions with Supabase Auth

### 🏢 Workspace System
- Multi-workspace support
- Custom branding with logo upload
- Primary color customization
- Widget settings per workspace

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Query** - Data fetching
- **Lucide React** - Icons

### Backend (Supabase)
- **Supabase Database** - PostgreSQL database
- **Supabase Auth** - User authentication
- **Supabase Storage** - File storage for logos and testimonial videos
- **Row Level Security (RLS)** - Data protection

## Database Schema

### Tables

#### `profiles`
- `id` (uuid, PK) - References auth.users
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `created_at`, `updated_at` (timestamp)

#### `workspaces`
- `id` (uuid, PK)
- `user_id` (uuid) - Owner reference
- `name` (text)
- `logo_url` (text)
- `primary_color` (text) - Hex color
- `created_at`, `updated_at` (timestamp)

#### `spaces`
- `id` (uuid, PK)
- `workspace_id` (uuid, FK)
- `name` (text)
- `slug` (text) - URL-friendly identifier
- `questions` (jsonb) - Custom collection questions
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

#### `testimonials`
- `id` (uuid, PK)
- `space_id` (uuid, FK)
- `type` (enum: 'video' | 'text')
- `status` (enum: 'pending' | 'approved' | 'rejected')
- `author_name` (text)
- `author_email` (text)
- `author_title` (text) - Job title
- `author_company` (text)
- `author_avatar_url` (text)
- `content` (text) - For text testimonials
- `video_url` (text) - For video testimonials
- `rating` (integer) - 1-5 stars
- `created_at` (timestamp)

#### `widget_settings`
- `id` (uuid, PK)
- `workspace_id` (uuid, FK)
- `layout` (text) - 'grid' or 'list'
- `dark_mode` (boolean)
- `show_video_first` (boolean)
- `created_at`, `updated_at` (timestamp)

#### `user_roles`
- `id` (uuid, PK)
- `user_id` (uuid)
- `role` (enum: 'admin' | 'user')
- `created_at` (timestamp)

### Security Functions

- `has_role(_user_id, _role)` - Check if user has specific role
- `owns_workspace(_user_id, _workspace_id)` - Verify workspace ownership
- `owns_space(_user_id, _space_id)` - Verify space ownership
- `get_space_owner(_space_id)` - Get owner of a space

### Storage Buckets

- `logos` (public) - Workspace logos
- `testimonials` (public) - Video testimonials and author avatars

## Lovable Cloud Configuration

### Database Features Used
- PostgreSQL with RLS enabled on all tables
- Custom ENUM types for status and roles
- Security definer functions to prevent RLS recursion
- Automatic profile creation via auth triggers

### RLS Policies

All tables have comprehensive RLS policies:

- **profiles**: Users can only view/update their own profile
- **workspaces**: Full CRUD for owners only
- **spaces**: 
  - Public read for active spaces (for collection forms)
  - Full CRUD for workspace owners
- **testimonials**:
  - Anyone can submit to active spaces
  - Public read for approved testimonials
  - Full management for space owners
- **widget_settings**: CRUD for workspace owners
- **user_roles**: Read-only for own roles

### Auth Configuration
- Auto-confirm email: **Enabled**
- Anonymous users: **Disabled**
- Signup: **Enabled**

## Project Structure

```
src/
├── assets/           # Static assets (logos, icons)
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   ├── WidgetPreview.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
├── hooks/
│   ├── useAuth.tsx      # Authentication context
│   ├── useWorkspace.tsx # Workspace management
│   ├── useSpaces.tsx    # Spaces CRUD
│   ├── useTestimonials.tsx # Testimonials CRUD
│   └── ...
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── types.ts     # Auto-generated types
├── pages/
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Login/Signup
│   ├── Onboarding.tsx  # Workspace setup
│   ├── Dashboard.tsx   # Main app
│   ├── Collect.tsx     # Public collection form
│   ├── Terms.tsx       # Terms of Service
│   ├── Privacy.tsx     # Privacy Policy
│   └── NotFound.tsx
└── index.css           # Global styles & design tokens
```

## Design System

### Colors (HSL Format)
- **Primary**: `hsl(210, 57%, 25%)` - Deep navy blue
- **Background**: `hsl(0, 0%, 100%)`
- **Foreground**: `hsl(210, 57%, 25%)`
- **Slate**: `hsl(210, 20%, 97%)`
- **Subtext**: `hsl(215, 16%, 47%)`

### Typography
- **Font**: System font stack
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

### Components
- Rounded corners: 4px-12px radius scale
- Subtle borders: 8% opacity
- Smooth animations via Framer Motion
- Consistent spacing using Tailwind

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Visit `http://localhost:5173`

## Environment Variables

Automatically provided by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Payment Integration (Coming Soon)

The project is prepared for Dodo Payments integration for Pro/Agency subscription tiers:

- **Free**: 1 space, 10 testimonials, basic widget
- **Pro** ($29/mo): Unlimited spaces, video testimonials, analytics
- **Agency** ($99/mo): White-label, team collaboration, API access

## Changelog

### Latest Updates (January 2, 2026)

1. **Avatar System**
   - Added avatar display in testimonial cards
   - Avatar support in Wall of Love view
   - Avatar integration in all widget preview styles

2. **Video Testimonial Badges**
   - Visual "Video" badge with play icon
   - Pro crown indicator for premium feature

3. **Logo Updates**
   - Created icon-only logo variant
   - Larger logo display across app (12x12 in dashboard)

4. **Navigation Improvements**
   - Removed unlinked menu items
   - Functional Features and Pricing links
   - Working Login/Get Started buttons

5. **New Pages**
   - Terms of Service (`/terms`)
   - Privacy Policy (`/privacy`)
   - All footer links now functional

6. **Share Button Fix**
   - Fixed share functionality in testimonial cards
   - Uses Web Share API with clipboard fallback
   - Toast notification on copy

7. **Widget Lab Enhancements**
   - Pro badges on premium widget styles
   - Improved testimonial rendering with avatars
   - Video indicator badges in widget preview

## License

© 2026 Vouchy. All rights reserved.
