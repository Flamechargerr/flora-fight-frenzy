# 🌱 Flora Fight Frenzy

[![Deploy](https://github.com/Flamechargerr/flora-fight-frenzy/actions/workflows/deploy.yml/badge.svg)](https://github.com/Flamechargerr/flora-fight-frenzy/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=flat&logo=github)](https://flamechargerr.github.io/flora-fight-frenzy/)

A modern tower defense game where you defend your garden from zombie invasion using strategic plant placement. Built with React, TypeScript, and enhanced with immersive audio effects and particle systems.

## 🎮 Play Now

**[🚀 Play Flora Fight Frenzy](https://flamechargerr.github.io/flora-fight-frenzy/)**

## ✨ Features

### 🎯 Core Gameplay
- **5 Challenging Levels**: Progressive difficulty with unique zombie types
- **Strategic Plant Placement**: 10+ different plant types with unique abilities
- **Wave-Based Combat**: Survive increasingly difficult zombie waves
- **Resource Management**: Collect sunlight to fund your defenses

### 🎨 Enhanced Experience  
- **Immersive Audio**: Procedurally generated sound effects using Web Audio API
- **Particle Effects**: Dynamic visual feedback for all game interactions
- **Achievement System**: 15+ achievements across 5 categories
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: 60fps gameplay with CSS3 and JavaScript animations

### 🏆 Game Systems
- **Achievement Tracking**: Combat, Defense, Survival, Collection, and Special achievements
- **Statistics Dashboard**: Track your progress and performance
- **Progress Persistence**: Your achievements and stats are saved locally
- **Multiple Difficulty Modes**: From casual garden defense to intense survival

## 🛠️ Technologies Used

### Frontend Stack
- **React 18.3** - Modern UI library with hooks
- **TypeScript 5.5** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components

### Game Engine
- **Custom React Game Loop** - 60fps game state management
- **Web Audio API** - Procedural sound generation
- **Canvas2D** - Particle effects and animations
- **Local Storage** - Save system and achievements

### Deployment
- **GitHub Actions** - Automated CI/CD
- **GitHub Pages** - Static site hosting
- **PWA Ready** - Offline capability support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with Web Audio API support

### Local Development

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/flora-fight-frenzy.git

# Navigate to project directory  
cd flora-fight-frenzy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🎮 How to Play

1. **Collect Sunlight**: Click on falling sun tokens to gather resources
2. **Plant Defenders**: Select plants from the panel and place them strategically
3. **Defend Your Garden**: Stop zombies from reaching the left side of your garden
4. **Survive Waves**: Each level has multiple waves of increasing difficulty
5. **Unlock Achievements**: Complete challenges to earn rewards and track progress

### 🌱 Plant Types

| Plant | Cost | Ability | Damage |
|-------|------|---------|--------|
| 🌻 Sunflower | 50 | Generates sun resources | 0 |
| 🌱 Peashooter | 100 | Basic projectile attacks | 20 |
| 🥜 Wall Nut | 50 | High health tank | 0 |
| ❄️ Ice Shooter | 175 | Slows down enemies | 10 |
| 🔥 Fire Shooter | 200 | High damage attacks | 50 |
| 🍒 Cherry Bomb | 150 | Area explosion damage | 100 |
| 🌿 Repeater | 200 | Double shot attacks | 40 |
| ☘️ Threepeater | 325 | Triple lane coverage | 20 |
| 🌵 Spikeweed | 100 | Ground-based passive damage | 10 |
| 🪵 Torchwood | 175 | Enhances nearby projectiles | 5 |

## 🏆 Achievement Categories

### ⚔️ Combat
- First Blood, Zombie Slayer, Undead Hunter, Apocalypse Survivor

### 🛡️ Defense  
- Green Thumb, Gardener, Master Gardener, Botanical Fortress

### 🎯 Survival
- Last Stand, Perfect Defense, Marathon Survivor

### ☀️ Collection
- Sun Collector, Solar Powered

### ⭐ Special
- Speed Runner, High Scorer, Garden Legend

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── game/           # Game-specific components
│   └── ui/             # Reusable UI components
├── game/               # Game logic and systems
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Game utilities
│   ├── constants.ts    # Game configuration
│   └── types.ts        # TypeScript definitions
├── lib/                # Core systems
│   ├── soundManager.ts     # Audio system
│   ├── particleSystem.ts   # Visual effects
│   └── achievementManager.ts # Achievement system
├── pages/              # Route pages
└── hooks/              # Global React hooks
```

## 🎵 Audio System

The game features a custom Web Audio API implementation that generates:
- **Procedural Sound Effects**: Shooting, planting, collection sounds
- **Dynamic Audio**: Context-aware audio feedback
- **No External Assets**: All audio generated in real-time
- **Customizable Volume**: User-controlled audio settings

## 🎨 Visual Effects

Custom particle system providing:
- **Explosion Effects**: Enemy defeats and plant abilities
- **Collection Sparkles**: Sun resource pickup feedback
- **Floating Text**: Score and damage indicators  
- **Smoke Trails**: Projectile and impact effects
- **60fps Performance**: Optimized rendering pipeline

## 🚀 Deployment

The game is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployment**: Push to `main` branch triggers deployment
2. **GitHub Pages**: Hosted at `https://flamechargerr.github.io/flora-fight-frenzy/`
3. **Custom Domain**: Can be configured in repository settings

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to GitHub Pages (if configured)
npm run deploy
```

### Alternative Hosting

- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: Use Firebase CLI

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use the GitHub Issues tab
- Include browser version and OS
- Provide steps to reproduce

### 💡 Feature Requests
- Suggest new plant types or abilities
- Propose gameplay mechanics
- Request quality of life improvements

### 🔨 Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 🎨 Assets & Design
- Create new plant or zombie sprites
- Design additional UI components
- Suggest visual improvements

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Plants vs. Zombies game
- Built with modern web technologies
- Sound effects generated using Web Audio API
- UI components from shadcn/ui library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Flamechargerr/flora-fight-frenzy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Flamechargerr/flora-fight-frenzy/discussions)
- **Email**: Create an issue for direct contact

---

**Enjoy defending your garden! 🌱⚔️🧟**
