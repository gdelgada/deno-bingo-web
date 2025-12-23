# 🎨 Web Interface - Preview

## 🌟 Setup Screen

```
╔════════════════════════════════════════════════════════════╗
║          🎱  B I N G O   M A S T E R  🎱                  ║
╚════════════════════════════════════════════════════════════╝
              Professional Drum Simulator


    ┌────────────────────────────────────────────┐
    │                                            │
    │       Setup New Game                       │
    │                                            │
    │       Number of Balls                      │
    │       ┌──────────────────────────┐         │
    │       │         90               │         │
    │       └──────────────────────────┘         │
    │       Choose between 10 and 200 balls      │
    │                                            │
    │       ┌──────────────────────────┐         │
    │       │  🎮  Start Game          │         │
    │       └──────────────────────────┘         │
    │                                            │
    └────────────────────────────────────────────┘
```

**Features:**
- ✨ Elegant design with dark background (#0a0e27)
- 🎨 Vibrant gradients in the title (purple)
- 💫 Animated particles in the background
- 🃏 Card with glassmorphism effect
- 🔘 Button with gradient and hover effect


## 🎮 Game Screen

```
╔════════════════════════════════════════════════════════════╗
║          🎱  B I N G O   M A S T E R  🎱                  ║
╚════════════════════════════════════════════════════════════╝


┌─────────┐  ┌─────────┐  ┌─────────┐
│ Called  │  │Remaining│  │  Total  │
│   42    │  │   48    │  │   90    │
└─────────┘  └─────────┘  └─────────┘


              Latest Ball
                  ┌───┐
                  │ 42│  ← Glow animation
                  └───┘
                 (ripple)


    ━━━━━━━━━━━━━━━━░░░░░░░░░░░  47%


    NUMBER BOARD
    ┌─────────────────────────────────────┐
    │ ⚫1  ⚫2  ✅3  ⚫4  ✅5  ⚫6  ✅7  ⚫8 │
    │ ✅9  ⚫10 ✅11 ⚫12 ⚫13 ✅14 ⚫15 ✅16│
    │ ⚫17 ✅18 ⚫19 ✅20 ⚫21 ⚫22 ✅23 ⚫24│
    │ ✅25 ⚫26 ⚫27 ✅28 ⚫29 ✅30 ⚫31 ⚫32│
    │ ⚫33 ✅34 ⚫35 ⚫36 ✅37 ⚫38 ✅39 ⚫40│
    │ ⚫41 🔴42 ⚫43 ✅44 ⚫45 ⚫46 ...  ⚫90│
    └─────────────────────────────────────┘

    ┌────────────────────────┐  ┌──────────────┐
    │ 🎲 Draw Next Ball      │  │  🔄 New Game │
    └────────────────────────┘  └──────────────┘
```

**Features:**
- 📊 Statistics cards with hover effect
- 🎯 Featured ball with pink-orange gradient
- 📈 Animated progress bar with shimmer effect
- 🎨 Responsive grid board
- ✅ Called balls in green
- 🔴 Latest ball with special glow effect
- ⚫ Uncalled balls in gray
- 🎹 Shortcut: Space to draw ball


## 🎉 Victory Screen

```
        ┌──────────────────────────────────┐
        │                                  │
        │  🎉 Game Completed! 🎉           │
        │                                  │
        │  All balls have been             │
        │  called                          │
        │                                  │
        │  ┌────────────────────────┐      │
        │  │ 🎮  Play Again         │      │
        │  └────────────────────────┘      │
        │                                  │
        └──────────────────────────────────┘
             
             ✨💫🎊🎈🎉  (confetti)
```

**Features:**
- 🎊 Animated confetti effect
- 🌟 Modal with blur backdrop
- 🎯 Scale-in animation on appearance
- 💜 Gradient button to restart


## 🎨 Color Palette

- **Main Background**: `#0a0e27` (Deep dark blue)
- **Cards**: `#1a1f3a` (Light dark blue)
- **Primary Gradient**: Purple (#667eea) → Violet (#764ba2)
- **Secondary Gradient**: Pink (#f093fb) → Red (#f5576c)
- **Success Gradient**: Blue (#4facfe) → Cyan (#00f2fe)
- **Called Ball**: Green (#11998e) → Light green (#38ef7d)
- **Latest Ball**: Pink (#ee0979) → Orange (#ff6a00)

## 📱 Responsive Design

- **Desktop**: 10-column grid, 60px balls
- **Tablet**: 8-column grid, 55px balls
- **Mobile**: 6-column grid, 50px balls
- **Small mobile**: Dynamic grid, 45px balls

## ✨ Animations

1. **fadeIn**: Smooth screen entrance
2. **popIn**: Ball marking animation (scale)
3. **pulse**: Continuous pulsation of current ball
4. **ripple**: Expanding waves around ball
5. **shimmer**: Shiny effect on progress bar
6. **glow**: Pulsating glow on latest ball
7. **confetti**: Celebratory particles on win
8. **particles**: Animated background of floating particles

## 🎯 Interactivity

- **Card hover**: Elevation and border glow
- **Button hover**: Elevation and ripple effect
- **Button click**: Press-down animation
- **Keyboard**: Enter (start), Space (draw ball)
- **Responsive**: Touch-friendly on mobile
