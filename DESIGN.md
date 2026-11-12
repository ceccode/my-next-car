---
name: My Next Car
description: A warm, thumb-first simulator that shows what each way of paying for a car really costs in total.
colors:
  ground: "#fff4e6"
  card: "#ffffff"
  surface: "#f7ebdd"
  line: "#ecdfcf"
  ink: "#2b241f"
  ink-soft: "#6b5e55"
  price: "#e6d3bd"
  extra: "#8a6f5c"
  action: "#ff6a3d"
  action-ink: "#c2410c"
  action-strong: "#c8441a"
  action-wash: "#ffe7dc"
  good: "#2f7a4f"
  good-wash: "#e3f2e8"
  warn: "#9a3b12"
typography:
  display:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontFeature: "'tnum' 1"
  display-detail:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.025em"
    fontFeature: "'tnum' 1"
  headline:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.56
  body:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1
  caption:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  chip:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  inner: "16px"
  card: "24px"
  sheet: "28px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    padding: "16px 20px"
  row-action:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "0 16px"
    height: "56px"
  row-action-hover:
    backgroundColor: "{colors.surface}"
  icon-button:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "10px 16px 8px"
  chip-best:
    backgroundColor: "{colors.action-strong}"
    textColor: "{colors.card}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  chip-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  notice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "12px 16px"
  notice-warn:
    backgroundColor: "{colors.action-wash}"
    textColor: "{colors.warn}"
    rounded: "{rounded.inner}"
    padding: "12px 16px"
  notice-good:
    backgroundColor: "{colors.good-wash}"
    textColor: "{colors.good}"
    rounded: "{rounded.inner}"
    padding: "12px 16px"
  dock:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.sheet}"
    padding: "8px 20px 12px"
  sheet:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    width: "32rem"
---

# Design System: My Next Car

## Overview

**Creative North Star: "The Warm Kitchen Table"**

A calm, warm consumer app you use with one thumb, at home or across a dealer's desk. Soft white cards sit on a peach-cream ground; dark warm brown carries the words and figures; a single saturated orange marks what you can touch and which option wins. Nothing is cold, gridded, or dashboard-like: the surface is a short stack of rounded cards, a dock of sliders under the thumb, and bottom sheets for everything secondary.

Density is low and figures are large. The price is the one thing typed, so it is the biggest type on screen; totals come next, set in tabular figures so they align and do not jitter as they animate. Every other input is a slider or lives one tap away in a sheet. Motion is part of the meaning: rows slide to their new rank and bars grow while a slider moves, on one long expo-out curve, and all of it collapses under reduced motion.

The system is light only (`color-scheme: light`). Depth is soft, warm-tinted ambient shadow, never hard edges.

**Key Characteristics:**
- Warm tinted ground with soft white 24px cards; no borders on cards.
- One orange action family: bright for fills, darker steps for text, chips and focus.
- Figtree Variable throughout, semibold for display and titles, tabular figures for every amount.
- Comparison as horizontal bars on one shared scale, the winner in orange.
- Mobile: bottom dock of sliders and bottom sheets. Desktop (768px+): sticky controls column left, results right, sheets centered.

## Colors

A warm, low-contrast cream-and-brown palette with one hot orange that does all the pointing.

### Primary
- **Ember Orange** (action): the touch color. Slider fill and thumb ring, the winning bar segment, the text caret in the price. Fills only; at 2.85:1 on white it never carries text.
- **Burnt Orange Ink** (action-ink): orange as text and icon on white or cream. Pencil and sliders icons, the "Inserisci i numeri" link, menu action glyphs.
- **Deep Ember** (action-strong): orange where it must hold white text or act as an indicator. The "Spendi meno" chip, the focus ring, the switch on-state, a focused field border, the solid price underline on focus.
- **Ember Wash** (action-wash): a whisper of orange. The winning row's tint (at 60% opacity), menu action icon discs, text selection, warning notices.

### Neutral
- **Peach Cream Ground** (ground): page and sheet background; also the empty track of a total bar and the hover tint inside cards.
- **Soft White** (card): every card, the dock, row actions, fields, round icon buttons.
- **Biscuit** (surface): quiet fills on cream or white. Hover state for white controls, neutral chips, icon tiles, the empty slider track, neutral notices.
- **Oat Line** (line): the only hairline. Divider between card zones, field and toggle borders, the sheet grab handle, the dashed price underline at rest.
- **Espresso** (ink): primary text and figures.
- **Walnut Gray** (ink-soft): labels, secondary lines, monthly payments, legend, chevrons.

### Data
- **Sand** (price): the price portion of a total bar and its legend dot. Deliberately pale: the bar is a picture of the figure beside it, not the carrier of the value.
- **Cocoa** (extra): the interest-and-fees portion of a bar, the part the product wants you to see.

### State
- **Leaf** (good) on **Mint Wash** (good-wash): only for a quoted TAEG that agrees with the estimate.
- **Rust** (warn) on Ember Wash: errors and a TAEG that disagrees with the estimate.

### Named Rules
**The One Hand Rule.** Orange means "you can touch this" or "this one wins". Nothing decorative is orange.

**The Bright-Fills-Dark-Speaks Rule.** Ember Orange is a fill. Any orange text or white-on-orange uses Burnt Orange Ink or Deep Ember.

**The Warm Shadow Rule.** Every shadow and scrim is tinted warm brown (rgb 66 41 20 / rgb 43 36 31), never neutral black.

## Typography

**Display Font:** Figtree Variable (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Figtree Variable, same stack
**Label/Mono Font:** none distinct; numbers use Figtree's tabular figures

**Character:** A rounded humanist sans used in one family at three weights: regular for prose, medium for labels, semibold for anything you read as a heading or a figure. Headings and large figures tighten tracking slightly.

### Hierarchy
- **Display** (600, 2.5rem rising to 3rem from 640px, tight leading): the editable price only.
- **Display Detail** (600, 2.25rem): the headline figure in a method sheet (monthly payment, cash paid now).
- **Headline** (600, 1.5rem): sheet titles, balanced.
- **Title** (600, 1.25rem): card titles ("Quanto spendi in tutto") and row totals (1.25rem to 1.5rem from 640px).
- **Title Small** (600, 1.125rem): sections and fieldset legends inside sheets, slider values, boxed field values.
- **Body** (400, 1rem): insight sentence (snug leading, pretty wrapping), sheet descriptions. Method names in rows sit at 1.05rem semibold.
- **Label** (500, 0.95rem, ink-soft): slider labels, notices (0.95rem regular).
- **Caption** (400 or 500, 0.875rem, ink-soft): field labels, hints, monthly payment lines, scope notes.
- **Chip** (600, 0.75rem): status pills and the bar legend.

### Named Rules
**The Tabular Figures Rule.** Every euro amount, percentage and count carries tabular figures (the `num` treatment). Body prose does not.

**The Price Is Biggest Rule.** Nothing on the main surface is set larger than the price.

## Layout

Single column on mobile with 16px side margins, cards stacked 16px apart, card interiors 20px (24px from 640px). The header is a 40px car tile plus the name on the left and a 44px round menu button on the right.

Mobile keeps the three sliders in a **dock** fixed to the bottom edge: white, 28px top corners, dock shadow, padded by the safe-area inset; the main column reserves 15rem of bottom padding so nothing hides under it.

From 768px the layout becomes two columns inside a 64rem container (left column up to 22rem, 24px gap). The left column (price card, then the sliders as an ordinary card) is sticky at 24px from the top; results and the quote row sit on the right. The dock loses its fixed position and takes the card radius and card shadow.

Rhythm runs on 8 / 12 / 16 / 20 / 24px. Touch targets are at least 44px (icon buttons 44px, list rows 48 to 64px tall, sliders 44px tall). Layout holds at 360px.

## Elevation & Depth

Soft, warm, ambient. Cards float a little off the cream ground with a two-layer shadow; the dock and sheets cast upward. Inside cards, hierarchy is tonal (Biscuit tiles, Ember Wash tint, Oat Line dividers), not shadowed.

### Shadow Vocabulary
- **Card** (`0 1px 2px rgb(66 41 20 / 0.04), 0 8px 24px -12px rgb(66 41 20 / 0.12)`): every card, white row action and round icon button.
- **Dock** (`0 -10px 30px -12px rgb(66 41 20 / 0.18)`): the mobile slider dock and sheets.
- **Thumb** (`0 2px 6px rgb(66 41 20 / 0.2)`): the slider thumb only.
- **Scrim** (`rgb(43 36 31 / 0.4)`): sheet backdrop.

### Named Rules
**The No-Border Card Rule.** Cards are separated from the ground by shadow and tone, never by an outline. Borders belong to fields and toggles inside sheets.

## Shapes

Everything is rounded and soft. Cards 24px; sheets and the dock 28px (top corners only on mobile, all four from 768px); inner tiles, rows, fields, notices and toggles 16px; chips, icon buttons, bars, slider tracks and thumbs fully round. The only line is a 1px Oat hairline; the price underline is a 2px dashed Oat stroke that turns solid Deep Ember on focus. Icons are Lucide outline glyphs at 20px (16px inline with text).

## Components

### Buttons
Buttons here are rows and circles, not filled pills. There is no filled orange call-to-action button.
- **Round icon button:** 44px circle, Soft White, card shadow, Espresso glyph; hover to Biscuit. Used for menu and sheet close.
- **Row action:** full-width white row, 16px radius (24px when it stands alone as a card), 56 to 64px tall, card shadow, optional icon tile or Ember Wash disc on the left, chevron on the right that nudges 2px on hover; hover to Biscuit.
- **In-card row:** a zone of a card separated by an Oat hairline, 48px tall, hover to Peach Cream Ground.
- **Focus:** 3px Deep Ember outline, 3px offset, 12px radius, everywhere.

### Chips
- **Best:** Deep Ember fill, white chip text ("Spendi meno").
- **Neutral:** Biscuit fill, Espresso or Walnut text ("Meglio a rate", "Esempio").

### Cards / Containers
- **Corner Style:** 24px.
- **Background:** Soft White on Peach Cream Ground.
- **Shadow Strategy:** Card shadow.
- **Border:** none.
- **Internal Padding:** 16 to 20px (24px from 640px).

### Inputs / Fields
- **Price input:** borderless, sized to its content, Display type, euro sign trailing in Walnut, a 44px pencil target, dashed underline that becomes solid Deep Ember on focus; formatted at rest, plain while typing, numeric keypad.
- **Boxed field (sheets):** white, 1px Oat border, 16px radius, caption label above a 1.125rem semibold value; border turns Deep Ember on focus.
- **Slider:** 44px hit area, 8px round track (Biscuit, filled Ember Orange to the value), 28px white thumb with a 3px Ember Orange ring and thumb shadow, scales to 1.15 while held; focus draws a Wash halo plus Deep Ember ring. Label left in Walnut, value right in Title Small Espresso.
- **Switch:** 48 by 28px, Oat track turning Deep Ember, white knob, inside a bordered white 16px row.

### Navigation
A top bar only: car tile and name left, round menu button right. Secondary destinations open as sheets.

### Sheets
Native dialog. On mobile a bottom sheet (28px top corners, grab handle, slides up 40% with fade over 420ms on the expo-out curve); from 768px a centered 32rem panel. Ground is Peach Cream, so cards inside it read as white. Header: Headline title, Walnut description, round close button.

### Total Cost Rows (signature)
The comparison: four rows ranked by total, each a 16px-radius button with method name, monthly line and chip on the left, the total (animated, tabular) and chevron on the right, and a 10px full-round bar beneath on one fixed shared scale. The bar has a Sand price segment and a Cocoa extra segment separated by a 2px gap; the winning row's price segment is Ember Orange and the row is tinted Ember Wash. Bars ease their width over 520ms; rows slide to new ranks with a 560ms FLIP on the expo-out curve. A two-dot legend sits under the list.

## Do's and Don'ts

### Do:
- **Do** put new controls on Soft White cards over Peach Cream Ground with the card shadow and 24px radius.
- **Do** keep Ember Orange for fills of touchable things and the winner; use Burnt Orange Ink for orange text and Deep Ember for white-on-orange and focus.
- **Do** set every amount with tabular figures and Figtree semibold.
- **Do** put secondary input in a sheet with boxed fields, not on the main surface.
- **Do** animate with the expo-out curve (cubic-bezier(0.16, 1, 0.3, 1)) and let reduced motion collapse it to 1ms.
- **Do** keep touch targets at 44px or more.

### Don't:
- **Don't** set text in Ember Orange or place white text on it.
- **Don't** introduce a second accent hue; Leaf green is reserved for the TAEG-agrees state.
- **Don't** outline cards or use neutral black or hard-offset shadows.
- **Don't** use square corners or radii outside 16 / 24 / 28px and full-round.
- **Don't** let any figure on the main surface outsize the price.
