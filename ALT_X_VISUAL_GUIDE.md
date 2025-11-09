# 🎨 Alt-X Visual Design Guide

## Before vs After

### **OLD (Lumina AI)**:
```
❌ Name: "Lumina AI"
❌ Header: Simple gradient (indigo → purple)
❌ Messages: Basic rounded corners
❌ Button: Flat design
❌ Loading: "Lumina is thinking..."
```

### **NEW (Alt-X)**:
```
✅ Name: "Alt-X"
✅ Header: Triple gradient (indigo → purple → pink)
✅ Messages: Rounded-2xl with shadows
✅ Button: Gradient with hover effects
✅ Loading: "Alt-X is thinking..."
```

---

## 🎨 Color Palette

### Primary Colors:
```css
Indigo-600: #4F46E5 (Primary)
Purple-600: #9333EA (Secondary)
Pink-600:   #DB2777 (Accent)
```

### Message Colors:
```css
User Messages:  indigo-600 → purple-600 (Gradient)
AI Messages:    White (#FFFFFF)
System:         purple-50 → pink-50 (Gradient)
Error:          red-50 background, red-600 text
```

### Background:
```css
Main:    gray-50 → gray-100 (Gradient)
Header:  indigo-600 → purple-600 → pink-600
Input:   gray-50 → white (Gradient)
```

---

## 📐 Layout Structure

### Full-Screen Mode:
```
┌─────────────────────────────────────────────┐
│ 🔹 Alt-X Assistant                     ×    │ ← Header (Gradient)
│ Real-time WHO Guidelines & Patient Support  │
├─────────────────────────────────────────────┤
│                                             │
│  👤 User Message (Gradient Box)             │
│     [Indigo → Purple gradient]              │
│                                             │
│  ✓ AI Response (White Box)                  │
│    [Green checkmark + white background]     │
│                                             │
│  ⏳ Alt-X is thinking... (Loading)          │
│                                             │
├─────────────────────────────────────────────┤
│ [Input field - rounded-xl]    [Send Button] │ ← Input Area
│                                [Gradient]   │
└─────────────────────────────────────────────┘
```

### Popup Mode:
```
                              ┌─────────────────┐
                              │ 🔹 Alt-X    ×   │ ← Header
                              ├─────────────────┤
                              │ 👤 User msg     │
                              │ ✓ AI response   │
                              ├─────────────────┤
                              │ [Input] [Send]  │
                              └─────────────────┘
```

---

## 🎭 Component Styling

### Header (Full-Screen):
```tsx
className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
           text-white p-6 shadow-lg"
```

### User Message:
```tsx
className="max-w-2xl bg-gradient-to-r from-indigo-600 to-purple-600 
           text-white px-5 py-3 rounded-2xl rounded-br-none shadow-md"
```

### AI Message:
```tsx
className="max-w-2xl px-5 py-3 rounded-2xl rounded-bl-none shadow-sm 
           bg-white border border-gray-200"
```

### Send Button:
```tsx
className="bg-gradient-to-r from-indigo-600 to-purple-600 
           hover:from-indigo-700 hover:to-purple-700 
           text-white px-6 py-3 rounded-xl 
           shadow-md hover:shadow-lg 
           transform hover:-translate-y-0.5 
           transition-all duration-200"
```

---

## 🌟 Interactive States

### Hover Effects:
```css
Button Hover:
  • Background: Darker gradient
  • Shadow: Larger (md → lg)
  • Transform: Lift up 0.5px
  • Cursor: Pointer

Input Focus:
  • Border: 2px indigo-500
  • Ring: 2px indigo-500
  • Outline: None
```

### Loading State:
```css
Spinner:
  • Color: indigo-600
  • Animation: spin
  • Size: h-5 w-5

Container:
  • Background: white
  • Border: indigo-200
  • Text: "Alt-X is thinking..."
```

### Error State:
```css
Container:
  • Background: red-50
  • Border: red-200
  • Icon: red-600 circle

Text:
  • Color: red-700
  • Size: text-sm
```

---

## 📱 Responsive Design

### Desktop (≥1024px):
```css
Max Width: 2xl (672px)
Padding: p-6
Font Size: text-sm
```

### Tablet (768px-1023px):
```css
Max Width: xl (576px)
Padding: p-4
Font Size: text-sm
```

### Mobile (<768px):
```css
Max Width: full
Padding: p-3
Font Size: text-xs
```

---

## 🎨 Typography

### Headers:
```css
H1 (Main Title):
  • Size: text-2xl
  • Weight: font-bold
  • Tracking: tracking-tight

H3 (Section):
  • Size: text-lg
  • Weight: font-semibold
```

### Messages:
```css
User Text:
  • Size: text-sm
  • Weight: font-normal
  • Leading: leading-relaxed
  • Color: white

AI Text:
  • Size: text-sm
  • Weight: font-normal
  • Leading: leading-relaxed
  • Color: gray-800

Timestamp:
  • Size: text-xs
  • Color: gray-500 / indigo-100
```

---

## 🔍 Accessibility

### ARIA Labels:
```tsx
<button aria-label="Send message" />
<div role="log" aria-live="polite" /> {/* Messages area */}
<input aria-label="Message input field" />
```

### Keyboard Navigation:
```
Tab:       Navigate between input and button
Enter:     Send message (from input)
Escape:    Close popup (if open)
```

### Color Contrast:
```
User Messages:  White on indigo-600 (AAA)
AI Messages:    Gray-800 on white (AAA)
Buttons:        White on indigo-600 (AAA)
```

---

## 🚀 Animation Timings

```css
Transitions:
  • All properties: 200ms
  • Easing: ease-in-out

Hover Effects:
  • Transform: instant
  • Shadow: 200ms
  • Background: 200ms

Loading Spinner:
  • Animation: 1s linear infinite
```

---

## 📊 Component Hierarchy

```
LuminaAssistant (Main)
├── isOpen (state) → Popup or Full-Screen
│
├── Popup Mode
│   ├── Header (compact)
│   ├── Messages Container
│   │   ├── User Messages
│   │   ├── AI Messages
│   │   ├── Loading Indicator
│   │   └── Error Display
│   └── Input Area
│       ├── Text Input
│       └── Send Button
│
└── Full-Screen Mode
    ├── Enhanced Header (3-gradient)
    ├── Messages Container (gradient bg)
    │   ├── User Messages (enhanced)
    │   ├── AI Messages (enhanced)
    │   ├── Loading Indicator (enhanced)
    │   └── Error Display (enhanced)
    └── Enhanced Input Area
        ├── Text Input (rounded-xl)
        └── Gradient Send Button
```

---

## 🎯 Design Principles

1. **Modern**: Gradients, shadows, rounded corners
2. **Clean**: Minimal clutter, clear hierarchy
3. **Intuitive**: Familiar chat interface
4. **Responsive**: Works on all devices
5. **Accessible**: WCAG AA compliant
6. **Performant**: Smooth animations
7. **Consistent**: Unified design language

---

**Generated**: November 7, 2025  
**Status**: Design Complete ✅
