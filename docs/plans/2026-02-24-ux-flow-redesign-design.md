# UX Flow Redesign

## Problem
After creating a list, user sees empty slot machine page with no guidance. Share link is always visible but only useful after spinning.

## Design

### Auto-open drawer when empty
- When items array is empty, auto-open the food drawer immediately
- Drawer can't be dismissed while items are empty (close button hidden or disabled)
- Once first item added, close button appears

### Share link moved to result
- Remove always-visible SHARE button from top-left
- Add SHARE button inside ResultDisplay overlay next to dismiss text

### Gear icon conditional
- Only show gear icon when items exist
- No gear icon on empty state (drawer is already open)

## Files Changed
- `SlotMachineClient.tsx` — auto-open drawer when empty, remove share button, conditional gear icon
- `ResultDisplay.tsx` — add share button
- `FoodDrawer.tsx` — prevent close when no items
