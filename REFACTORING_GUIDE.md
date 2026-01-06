# Feature-Based Architecture Refactoring - Complete Guide

## Current Status

### ✅ Components Created:
1. **`src/hooks/useRecorder.ts`** - MediaRecorder logic (160 lines)
2. **`src/components/dashboard/TestimonialGrid.tsx`** - Testimonial display (178 lines)
3. **`src/components/dashboard/AnalyticsCards.tsx`** - Stats cards (25 lines)
4. **`src/components/dashboard/SpaceSettings.tsx`** - Space list (45 lines)
5. **`src/components/collect/VideoRecorder.tsx`** - Video recording UI (417 lines)
6. **`src/components/collect/TextForm.tsx`** - Text testimonial form (280 lines)

### Current Line Counts:
- **Dashboard.tsx**: 1,171 lines (still too large!)
- **Collect.tsx**: 851 lines (still too large!)

## Why Are They Still Large?

### Dashboard.tsx (1,171 lines) contains:
1. **Sidebar** (~100 lines) - Should be extracted
2. **Widget Lab Section** (~400+ lines) - HUGE! Should be extracted
3. **Wall of Love View** (~100 lines) - Should be extracted  
4. **Settings View** (~100 lines) - Should be extracted
5. **PlanUpgradeCard** (~170 lines) - Inline component, should be extracted

### Collect.tsx (851 lines) contains:
1. **Old Video Recorder JSX** (lines 264-596 = ~332 lines) - **NOT YET REPLACED**
2. **Old Text Form JSX** (lines 598-808 = ~210 lines) - **NOT YET REPLACED**

## Required Manual Fixes

### 1. Collect.tsx - Replace Video Recorder Section

**Find lines 264-596** (the entire video recorder JSX starting with):
```tsx
{/* Video Recorder */}
{mode === "video" && (
  <motion.div
    key="video"
    className="w-full max-w-4xl"
    ...
```

**Replace with**:
```tsx
{/* Video Recorder */}
{mode === "video" && (
  <VideoRecorder
    questions={questions}
    canUseAI={canUseAI}
    onSubmit={handleVideoSubmit}
    onBack={() => setMode("select")}
    submitting={submitting}
  />
)}
```

### 2. Collect.tsx - Replace Text Form Section

**Add import at top**:
```tsx
import { TextForm } from "@/components/collect/TextForm";
```

**Find the text form section** (around lines 598-808, starting with):
```tsx
{/* Text Form */}
{mode === "text" && (
  <motion.div
    key="text"
    className="w-full max-w-lg"
    ...
```

**Replace with**:
```tsx
{/* Text Form */}
{mode === "text" && (
  <TextForm
    canUseAI={canUseAI}
    onSubmit={handleTextSubmit}
    onBack={() => setMode("select")}
    submitting={submitting}
  />
)}
```

**Add this handler function** (after `handleVideoSubmit`):
```tsx
const handleTextSubmit = async (formData: {
  name: string;
  email: string;
  company: string;
  title: string;
  testimonial: string;
  rating: number;
}, avatarFile: File | null) => {
  if (!space) return;

  const { error } = await submitTextTestimonial({
    spaceId: space.id,
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: formData.company.trim() || undefined,
    title: formData.title.trim() || undefined,
    content: formData.testimonial.trim(),
    rating: formData.rating,
    avatarFile: avatarFile || undefined,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Submission failed",
      description: "Please try again.",
    });
    return;
  }

  setMode("success");
};
```

**Remove these from Collect.tsx** (no longer needed):
- `textForm` state
- `avatarFile` state
- `avatarPreview` state
- `avatarInputRef` ref
- `errors` state
- `submitText` function
- `textFormSchema` import and definition

### 3. Dashboard.tsx - Further Refactoring (Optional but Recommended)

The Dashboard is still large because it contains:
- Widget Lab view (400+ lines)
- Sidebar JSX (100+ lines)
- Other view sections

**Recommended next steps**:
1. Extract **Widget Lab** into `src/components/dashboard/WidgetLabView.tsx`
2. Extract **Sidebar** into `src/components/dashboard/Sidebar.tsx`
3. Extract **PlanUpgradeCard** into `src/components/dashboard/PlanUpgradeCard.tsx`

## Expected Results After Manual Fixes

### Collect.tsx:
- **Before**: 851 lines
- **After**: ~250-300 lines (removing ~550 lines of JSX)

### Dashboard.tsx:
- **Current**: 1,171 lines
- **After Widget Lab extraction**: ~700 lines
- **After Sidebar extraction**: ~600 lines
- **After all extractions**: ~400-500 lines

## Summary

The components are created and working (build passes!), but the **old JSX code is still in the files**. You need to:

1. **Delete the old video recorder JSX** and replace with `<VideoRecorder />`
2. **Delete the old text form JSX** and replace with `<TextForm />`
3. **Remove unused state/functions** from Collect.tsx

This will reduce Collect.tsx from 851 to ~300 lines immediately!
