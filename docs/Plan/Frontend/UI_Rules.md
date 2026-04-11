# 🎨 Frontend Design System (UI Rules)

## 🧠 Core Principle
> Build using components, not custom CSS

---

## 🎨 1. Color System

### ✅ Allowed Colors (ONLY use these)
- primary
- secondary
- accent
- destructive
- muted
- background

### ❌ Not Allowed
- random Tailwind colors (e.g., red-500, blue-300)
- custom hex codes

---

## 🎨 2. Button System

### ✅ Use Predefined Button Component

Allowed variants:
- default
- outline
- secondary
- ghost
- link
- hero

### ✅ Example
```jsx
<Button variant="default">Submit</Button>
❌ Not Allowed
<button class="bg-blue-500 text-white">
🎨 3. Card System
✅ Use Card Components Only

Structure:

<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
❌ Not Allowed
Custom div-based cards
Random padding/styling
🎨 4. Form System
✅ Use Form Components
Form
FormField
FormItem
FormLabel
FormControl
❌ Not Allowed
Raw <input> without structure
No validation handling
🎨 5. Spacing System
✅ Allowed Spacing Values
Padding: p-4, p-6
Gap: gap-2, gap-4
Vertical spacing: space-y-2, space-y-4
❌ Not Allowed
Random values (p-7, gap-9, etc.)
🎨 6. Typography
✅ Allowed Text Sizes
text-sm
text-base
text-lg
text-2xl
✅ Allowed Font Weights
font-medium
font-semibold
❌ Not Allowed
Random font sizes or weights
🎨 7. Layout System
✅ Use Layout Wrapper
<Layout>
  <PageContent />
</Layout>
Header and Footer must always be included
🎨 8. Navigation
✅ Use Existing Header Component
Do NOT create new navbars
Use predefined navigation structure
🎨 9. Animation Rules
✅ Allowed
Default subtle animations
Hover effects
❌ Not Allowed
Heavy animations
Unnecessary transitions
🎨 10. Component Usage Rule (MOST IMPORTANT)
✅ Rule:

Before creating any UI:

Check if a component already exists

❌ Never:
Duplicate components
Create new styles unnecessarily
🔥 Final Rule

Consistency > Creativity

Keep UI:

Simple
Clean
Reusable
Predictable