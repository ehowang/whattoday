# Paytable Panel Redesign

## Problem
Current paytable is too simplified compared to the reference. Needs classic casino paytable layout with retro typography and steady backlight.

## Design

### Font
Abril Fatface from Google Fonts — bold display face with circus/poster vibe. Used for numbers and "PAYTABLE" title.

### Layout (3-column grid)
- **Left**: 😋😋😋 7000 (JACKPOT), 🍔🍔🍔 1000, 🍕🍕🍕 50, 🌮🌮 30
- **Center**: 🍜🍜🍜 5000, 🍣🍣 250, 🥗🥗 100, 🍔 25
- **Right**: Large "777" with 1500, plus smaller combo rows

### Backlight
Steady warm amber glow via inset box-shadow. Dark translucent background. Scanline overlay for retro glass feel. No animation.

### Files Changed
- `src/app/layout.tsx` — Add Abril Fatface Google Font
- `src/components/SlotMachine.tsx` — Rewrite paytable section with 3-column grid
