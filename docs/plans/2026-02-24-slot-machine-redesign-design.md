# Slot Machine UI Redesign -- Design Doc

**Goal:** Transform the current stylized 2D slot machine into a photorealistic skeuomorphic casino machine matching the reference image at `references/slot_machine.png`.

## Style: Photorealistic Skeuomorphism

- Blurred casino background (depth of field)
- Brushed stainless steel frame with chrome edge highlights
- Subtle aged/worn details for authenticity
- Ambient neon reflections (pink/blue color spill)

## 3-Zone Layout

### Top -- Paytable Panel
- Warm backlit acrylic panel with glow
- Food-themed paytable info (3x = JACKPOT, 2x = NICE, etc.)
- Retro bold serif font, slight yellowed tint

### Middle -- Reel Window
- 3 reel columns with deep inner shadow (recessed look)
- Light/cream reel background (not dark)
- Chrome separators between reels
- Food items on light background

### Bottom -- Control Panel
- 3D SPIN button with press-down depth effect
- Brushed metallic control panel surface
- Realistic button look on both desktop and mobile

### Right Side -- Lever
- Longer chrome arm mounted to machine body
- Red ball handle with realistic shading

## Key Animations

- **Lever pull**: Spring physics with overshoot + damped oscillation
- **Reel stop**: Overshoot past target then bounce-back lock (mechanical click feel)
- **Button press**: Y-axis displacement + shadow deepening
- **Win state**: Paytable panel lights flash in marquee pattern

## Implementation Approach

Pure CSS3 + Framer Motion (2.5D, no Three.js). Layered gradients, box-shadows, and transforms for photorealistic look.

## Reference Materials
- `references/slot_machine.png` -- target visual
- `docs/老虎机视觉设计方案.txt` -- detailed design spec (Chinese)
