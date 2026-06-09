---
name: Sticker Arena 2026
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#006229'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e37'
  on-tertiary-container: '#c1ffc5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  sky-blue: '#60A5FA'
  pitch-green: '#16A34A'
  sticker-white: '#FFFFFF'
  paper-shadow: '#0A0F1E1A'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sticker-gap: 16px
  page-margin: 24px
  section-padding: 48px
---

## Brand & Style

The design system is built around the nostalgic and tactile joy of collecting football sticker albums. It targets a global audience of sports fans participating in the World Cup 2026 prediction market, evoking feelings of excitement, playfulness, and high-stakes fun.

The aesthetic follows a **Tactile / Sticker-Book** style. It moves away from the sterile corporate look of traditional prediction markets, instead favoring a "physical world" metaphor where every UI element—from match cards to user avatars—feels like a high-quality vinyl sticker placed onto a clean, sun-drenched album page. Visuals are characterized by white die-cut borders, subtle rotation offsets (mimicking manual placement), and "peeling" corner effects to signify interactivity.

## Colors

The palette is inspired by the vibrant atmosphere of a summer tournament. 

- **Primary (Blue):** Used for interactive states, primary actions, and "Official" branding elements.
- **Secondary (Sunny Yellow):** Used for highlights, winning predictions, and "Golden" rewards.
- **Tertiary (Grassy Green):** Represents the pitch; used for positive trends, "Go" actions, and success states.
- **Neutral:** A very light, warm gray-white is used for the "Album Page" background to allow the pure white sticker borders to pop.

The design system exclusively uses **Light Mode** to maintain the bright, airy feel of a physical paper album.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, rounded terminals and high readability. It strikes the perfect balance between professional sports data and playful stickers.

- **Headlines:** Set with heavy weights (Bold/ExtraBold) and tight letter spacing to mimic the blocky printing of sports magazines.
- **Body:** Kept clean and airy for legibility in prediction markets and data tables.
- **Labels:** Small, bold caps are used for "Sticker Pack" categories and metadata.

Large headlines should scale down for mobile to ensure "sticker" elements have enough room to breathe on the digital page.

## Layout & Spacing

The layout follows a **Fluid Grid** approach but with a unique twist: elements are intentionally "imperfect." 

- **The Album Grid:** Content is organized in a 12-column grid, but individual components (stickers) should occasionally feature a slight CSS rotation (between -1.5deg and 1.5deg) to break the rigid digital feeling.
- **Safe Zones:** High margins are maintained around the "Album" edges to emphasize the physical boundaries of the screen.
- **Rhythm:** An 8px base unit is used for padding and internal spacing, while a larger 16px "sticker-gap" ensures elements don't overlap unless intended for a "collage" effect.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Ambient Shadows** that mimic physical paper on paper.

- **Layer 0 (Background):** The "Album Page" (Neutral color).
- **Layer 1 (Stickers):** Pure white backgrounds with a 2px white "die-cut" border. These use a very soft, multi-layered shadow (0px 4px 12px) to look like they are slightly raised.
- **Hover States:** When a user hovers over a sticker, it should "lift" (scale 1.05 and deepen the shadow).
- **Peeling Effect:** Use a CSS mask or a corner-fold graphic on the top-right of active stickers to suggest they can be interacted with or "flipped."

## Shapes

The design system uses **Rounded** corners to reinforce the friendly, safe nature of a sticker collection. 

- **Stickers:** Most components use a 0.5rem (8px) radius. 
- **Buttons:** Primary buttons use a higher roundedness (Pill-shaped) to distinguish them from static sticker elements.
- **Borders:** All primary components must have a prominent 2pt to 4pt white border, even when placed on light backgrounds, to maintain the "cut-out" aesthetic.

## Components

- **Buttons:** Designed as "Glossy Stickers." They use high-saturation backgrounds (Blue/Green) with a subtle inner-glow to look slightly convex and physical.
- **Sticker Cards:** The hero of the design. Used for match matchups and player stats. They feature a white border and a slight tilt. Use "peeled corner" icons to indicate more details are available.
- **Chips / Badges:** Small, circular stickers for team logos or "LIVE" status. These should look like tiny reward stickers.
- **Input Fields:** Recessed into the "album page" with a subtle inner shadow, looking like slots cut into the paper where stickers or notes are placed.
- **Lists:** Rows should appear as long, horizontal strips of tape or stickers with jagged "torn" ends on the left and right.
- **Icons:** Use thick, rounded line weights and vibrant colors. Match the "fun" aesthetic with illustrated-style icons rather than thin, clinical ones.
- **Specialty "Shiny" Cards:** For top-tier predictions or rare events, use a holographic CSS gradient overlay to mimic "Shiny" or "Foil" stickers.