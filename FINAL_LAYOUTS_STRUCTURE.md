# Vouchy Widget Layouts - Final Structure

## Overview
Vouchy now offers **15 premium testimonial layouts** organized into 2 free layouts and 13 premium layouts.

---

## Free Layouts (2)

### 1. **Cards** (`cards`)
- **Description**: Modern cards
- **Features**: Clean card grid with hover effects
- **Best For**: General purpose, professional testimonials

### 2. **Minimal Stacked** (`minimalStacked`)
- **Description**: Clean vertical list
- **Features**: Simple stacked cards with left border accents
- **Best For**: Content-focused, minimal designs

---

## Premium Layouts (13)

### 3. **Bento** (`bento`)
- **Description**: Structured grid
- **Features**: Asymmetric bento-box style layout
- **Best For**: Visual variety, featured testimonials

### 4. **Marquee** (`marquee`)
- **Description**: Infinite scroll
- **Features**: Auto-scrolling horizontal carousel
- **Best For**: Continuous display, high-traffic pages

### 5. **Timeline** (`timeline`)
- **Description**: Story flow
- **Features**: Vertical timeline with chronological display
- **Best For**: Journey narratives, progress stories

### 6. **Floating Cards** (`floating`)
- **Description**: 3D hover effect
- **Features**: Cards with floating animations and depth
- **Best For**: Modern, interactive experiences

### 7. **Glass Prism** (`glass`)
- **Description**: Refractive masonry
- **Features**: Glassmorphic cards with prismatic effects
- **Best For**: Premium, artistic presentations

### 8. **Polaroid Stack** (`polaroid`)
- **Description**: Nostalgic moments
- **Features**: Polaroid-style cards with tape effects
- **Best For**: Personal, authentic testimonials

### 9. **Parallax Scroll** (`parallax`)
- **Description**: Smooth motion
- **Features**: Alternating parallax scroll effects
- **Best For**: Long-form content, storytelling

### 10. **Cinematic** (`cinematic`)
- **Description**: Widescreen slider
- **Features**: 21:9 aspect ratio slider with video support
- **Best For**: Video testimonials, hero sections

### 11. **Orbit Ring** (`orbit`)
- **Description**: Circular showcase
- **Features**: Avatars orbiting central testimonial
- **Best For**: Interactive, engaging displays

### 12. **Radial Burst** (`radial`)
- **Description**: Explosive energy
- **Features**: Radial animation with pulsing effects
- **Best For**: High-energy, attention-grabbing

### 13. **News Ticker** (`news`)
- **Description**: Featured highlight
- **Features**: Featured testimonial with sidebar list
- **Best For**: Highlighting top testimonials

### 14. **Masonry Wall** (`masonryWall`)
- **Description**: Dense grid
- **Features**: Dynamic masonry layout with responsive columns
- **Best For**: Large collections, Pinterest-style

### 15. **Deck Stack** (`deck`)
- **Description**: Interactive deck
- **Features**: 3D stacked cards with swipe interaction
- **Best For**: Mobile-first, card-based navigation

---

## Technical Details

### File Structure
```
src/components/widgets/layouts/
├── CardsLayout.tsx
├── BentoLayout.tsx
├── MarqueeLayout.tsx
├── TimelineLayout.tsx
├── FloatingCardsLayout.tsx
├── GlassPrismLayout.tsx
├── PolaroidStackLayout.tsx
├── ParallaxScrollLayout.tsx
├── MinimalStackedLayout.tsx
├── CinematicSliderLayout.tsx
├── OrbitRingLayout.tsx
├── RadialBurstLayout.tsx
├── NewsTickerHeroLayout.tsx
├── MasonryWallLayout.tsx
├── StackedCardsLayout.tsx
└── index.ts
```

### Common Features (All Layouts)
- ✅ Full `customStyles` support
- ✅ Dark mode compatibility
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ Video testimonial support
- ✅ Brand color integration
- ✅ Framer Motion animations
- ✅ TypeScript type safety

### Removed Layouts
The following layouts were removed to streamline the offering:
- ❌ `MinimalLayout` (replaced by MinimalStackedLayout)
- ❌ `MasonryLayout` (replaced by MasonryWallLayout)
- ❌ `AvatarLayout` (redundant with other layouts)
- ❌ `StackLayout` (replaced by StackedCardsLayout)
- ❌ `SpotlightLayout` (consolidated into other premium layouts)

---

## Usage

### In Widget Lab
Users can select any layout from the sidebar. Free users have access to the 2 free layouts (Cards and Minimal Stacked), while Pro users can access all 15 layouts.

### Default Layout
If no layout is specified or an invalid layout ID is provided, the system defaults to `CardsLayout`.

### Layout Selection
```typescript
// widgetUtils.ts
export const widgetStyles = [
  // Free (2)
  { id: "cards", name: "Cards", description: "Modern cards", isPro: false },
  { id: "minimalStacked", name: "Minimal Stacked", description: "Clean vertical list", isPro: false },
  
  // Premium (13)
  { id: "bento", name: "Bento", description: "Structured grid", isPro: true },
  { id: "marquee", name: "Marquee", description: "Infinite scroll", isPro: true },
  // ... and 11 more premium layouts
];
```

---

## Migration Complete ✅

All layouts have been:
- ✅ Migrated to use Vouchy's design system
- ✅ Updated to use correct component imports
- ✅ Fixed for TypeScript errors
- ✅ Integrated into Widget Lab
- ✅ Documented and organized

**Total Layouts**: 15 (2 Free + 13 Premium)
