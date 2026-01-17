# Vouchy Project Overview

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
- **5 Widget Styles**: Minimal, Cards, Masonry, Marquee, Spotlight
- **Dark/Light Mode**: Toggle between themes
- **Layout Options**: Grid or list layouts
- **Video Priority**: Option to show video testimonials first

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Query** - Data fetching

### Backend (Supabase)
- **Supabase Database** - PostgreSQL
- **Supabase Auth** - Authentication
- **Supabase Storage** - File storage
- **RLS** - Row Level Security

## Database Schema

### Key Tables
- `profiles`: User information and settings
- `workspaces`: High-level business organizational units
- `spaces`: Individual testimonial collection entities
- `testimonials`: The actual video/text feedback
- `widget_settings`: Customization for embedded widgets

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access at `http://localhost:5173`
