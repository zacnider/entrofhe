# Entrofhe Design Proposal

## Design Philosophy

**Modern, Minimal, Professional** - A design that reflects the cutting-edge nature of FHE technology while remaining accessible and developer-friendly.

## Color Scheme

### Light Theme
- **Primary**: Deep Blue (#0ea5e9) - Trust, technology, security
- **Background**: Clean white with subtle gradients
- **Text**: Dark gray (#1f2937) for readability
- **Accents**: Cyan/Teal for highlights (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Dark Theme
- **Primary**: Bright Cyan (#06b6d4) - Stands out on dark
- **Background**: Deep dark (#0f172a) with subtle gradients
- **Text**: Light gray (#f1f5f9) for readability
- **Accents**: Blue (#3b82f6) for highlights
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

## Typography

- **Headings**: Inter or System font, bold weights
- **Body**: System font stack for performance
- **Code**: JetBrains Mono or Fira Code for monospace

## Layout Principles

1. **Spacing**: Generous whitespace (8px grid system)
2. **Cards**: Subtle shadows, rounded corners (12px)
3. **Borders**: Thin, subtle (1px)
4. **Transitions**: Smooth animations (200-300ms)

## Component Styles

### Cards
- Rounded corners: `rounded-xl` (12px)
- Shadow: Subtle elevation
- Padding: Generous (24-32px)
- Border: Optional subtle border

### Buttons
- Primary: Solid with hover effects
- Secondary: Outlined
- Size: Comfortable padding (12px 24px)
- Rounded: `rounded-lg` (8px)

### Inputs
- Rounded: `rounded-lg`
- Border: Focus ring on active
- Padding: Comfortable (12px 16px)

## Visual Elements

### Gradients
- Subtle background gradients
- Accent gradients for CTAs
- No harsh transitions

### Icons
- Heroicons (outline style)
- Consistent sizing
- Proper spacing

### Status Indicators
- Color-coded badges
- Clear visual hierarchy
- Accessible contrast

## Key Pages Design

### Home Page
- Hero section with clear value proposition
- Simple request form (centered, card-based)
- Status indicators (clean, minimal)
- Request history (table or list)

### Admin Page
- Owner-only access (clear messaging)
- Simple form for seed initialization
- Warning messages (prominent but not alarming)
- Success states (clear feedback)

### Dashboard
- Stats cards (grid layout)
- Code examples (syntax highlighted)
- Integration guide (step-by-step)
- Clean navigation tabs

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons (min 44px)
- Readable text sizes

## Accessibility

- WCAG AA contrast ratios
- Keyboard navigation
- Screen reader friendly
- Focus indicators

## Animation & Interactions

- Subtle hover effects
- Smooth transitions
- Loading states (skeletons or spinners)
- Success animations (toast notifications)

## Brand Identity

- **Name**: Entrofhe (Entropy + FHE)
- **Tagline**: "FHE-Powered Entropy Oracle"
- **Tone**: Professional, technical, trustworthy
- **Visual**: Clean, modern, tech-forward

## Implementation Notes

- Use Tailwind CSS for styling
- Dark mode via `dark:` classes
- Theme toggle in header
- Consistent spacing scale
- Reusable component library

---

**Ready for implementation?** This design balances modern aesthetics with functionality, ensuring a great developer experience while maintaining professional standards.

