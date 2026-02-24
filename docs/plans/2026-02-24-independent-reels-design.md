# Independent Reels & Speed Tuning

## Problem
All 3 reels always land on the same item (same `winnerIndex`), which doesn't feel like a real slot machine. Additionally, spin duration is too short and reel speed is too slow.

## Design

### Reel Independence
- Each reel picks its own random `winnerIndex` independently
- Natural match probability: ~1/N (where N = food item count)

### Result Logic
- **Triple match**: Big celebration — confetti, win sound, glowing result display
- **No match**: Center reel (reel 2) item is the result — simpler result display, no confetti, quieter/no win sound

### Reel Speed & Timing
- Spin durations: 3.5s / 4.5s / 5.5s (up from 2.5 / 3.2 / 3.8)
- Repeats: 20 (up from 10) — items whiz by much faster, then decelerate into bounce-back

### Files Changed
- `src/components/SlotMachine.tsx` — 3 independent winnerIndex values, detect triple match, pass `isJackpot` to ResultDisplay
- `src/components/Reel.tsx` — increase repeats to 20
- `src/components/ResultDisplay.tsx` — two modes: jackpot (confetti + glow) vs normal pick (simpler animation)
