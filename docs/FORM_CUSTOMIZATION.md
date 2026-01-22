# Form Customization Feature

## Overview
This feature allows workspace owners to fully customize their testimonial collection forms, including field visibility, validation rules, theme colors, and custom messages.

## What's New

### 1. **Database Schema**
- Added `form_settings` JSONB column to the `spaces` table
- Stores comprehensive form configuration including:
  - Field settings (enabled, required, labels, placeholders, validation)
  - Theme settings (accent color, background color, card style)
  - Custom messages (title, subtitle, button text, success messages)

### 2. **Form Fields Settings Component** (`src/components/settings/FormFieldsSettings.tsx`)
A comprehensive UI for managing form customization with three tabs:

#### **Fields Tab**
- Toggle each field on/off (name, email, title, company, rating, avatar, testimonial)
- Set required/optional status
- Customize labels and placeholders
- Set validation rules (min/max length for testimonial field)
- Add help text

#### **Theme Tab**
- Choose accent color (affects buttons, highlights, borders)
- Set background color
- Select card style:
  - **Modern**: Clean with shadows
  - **Minimal**: Simple and lightweight
  - **Glassmorphism**: Frosted glass effect

#### **Messages Tab**
- Customize form title and subtitle
- Change submit button text
- Personalize success message title and description

#### **Live Preview**
- Real-time preview of how the form will look
- Shows all customizations applied

### 3. **Dynamic Form Rendering** (`src/components/collect/TextForm.tsx`)
The testimonial form now:
- Dynamically shows/hides fields based on settings
- Applies custom validation rules
- Uses theme colors throughout
- Displays custom messages
- Adapts card styling based on selected theme

### 4. **Type Safety** (`src/types/formSettings.ts`)
- Comprehensive TypeScript interfaces for all settings
- Default configuration with sensible values
- Helper function to merge partial settings with defaults

## How to Use

### For Workspace Owners:
1. Navigate to **Dashboard** → **Collections**
2. Click on a collection to open settings
3. Scroll to the **Form Customization** section
4. Configure your form using the three tabs:
   - **Fields**: Control what information you collect
   - **Theme**: Match your brand colors and style
   - **Messages**: Personalize the user experience
5. Use the **Show Preview** button to see changes in real-time
6. Click **Save Changes** to apply

### For Testimonial Submitters:
- The form automatically adapts to the workspace owner's settings
- Only enabled fields are shown
- Required fields are marked with *
- Theme colors create a cohesive brand experience
- Custom messages provide personalized guidance

## Examples

### Minimal Configuration
```json
{
  "fields": {
    "name": { "enabled": true, "required": true },
    "email": { "enabled": true, "required": true },
    "testimonial": { "enabled": true, "required": true }
  },
  "theme": {
    "cardStyle": "minimal"
  }
}
```

### Full Brand Experience
```json
{
  "fields": {
    "name": { "enabled": true, "required": true, "label": "Your Full Name" },
    "email": { "enabled": true, "required": true, "label": "Work Email" },
    "company": { "enabled": true, "required": true, "label": "Company Name" },
    "title": { "enabled": true, "required": true, "label": "Job Title" },
    "testimonial": { 
      "enabled": true, 
      "required": true, 
      "label": "Share Your Success Story",
      "minLength": 50,
      "placeholder": "Tell us how our product transformed your business..."
    }
  },
  "theme": {
    "accentColor": "#6366f1",
    "backgroundColor": "#fefefe",
    "cardStyle": "glassmorphism"
  },
  "messages": {
    "title": "Share Your Success Story",
    "subtitle": "Help others discover how we can help them succeed",
    "submitButton": "Submit My Story",
    "successTitle": "You're Amazing!",
    "successMessage": "Thank you for sharing your success story. We'll review it and feature it on our website soon!"
  }
}
```

## Technical Details

### Database Migration
```sql
ALTER TABLE public.spaces 
ADD COLUMN IF NOT EXISTS form_settings jsonb DEFAULT '{...}'::jsonb;
```

### Default Settings
All new collections automatically get sensible defaults that can be customized later.

### Validation
- Client-side validation based on field settings
- Required fields are enforced
- Min/max length validation for testimonial field
- Email format validation

### Theming
- Accent color applied to: buttons, stars, borders, highlights
- Background color for form card
- Three card styles with different visual treatments
- Smooth transitions and hover effects

## Benefits

1. **Brand Consistency**: Match forms to your brand identity
2. **Flexibility**: Collect exactly the information you need
3. **User Experience**: Create personalized, engaging forms
4. **Validation Control**: Set your own rules for data quality
5. **Professional Look**: Choose from modern design styles
6. **Easy to Use**: Intuitive interface with live preview

## Future Enhancements
- Conditional field visibility
- Custom field types
- Multi-language support
- Advanced validation rules (regex patterns)
- Form analytics and conversion tracking
