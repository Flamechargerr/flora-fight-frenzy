# 🌻 Flora Fight Frenzy - Plants vs Zombies Clone 🧟

<div align="center">

![Plants vs Zombies Banner](screenshots/Arena.png)

**A fully-featured Plants vs Zombies clone built in Java/JavaFX**

[![Made by Anamay](https://img.shields.io/badge/Made%20by-Anamay%20(Flamechargerr)-green)](https://github.com/Flamechargerr)
[![Java](https://img.shields.io/badge/Java-17+-orange)](https://adoptium.net/)
[![JavaFX](https://img.shields.io/badge/JavaFX-17+-blue)](https://openjfx.io/)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue)](LICENSE)

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [How to Play](#-how-to-play) • [Credits](#-credits)

</div>

---

## 👨‍💻 About

**Flora Fight Frenzy** is a complete recreation of the classic tower defense game "Plants vs Zombies". Built using Java and JavaFX, this game features smooth animations, sound effects, save/load functionality, and 5 challenging levels.

### Built by
**Anamay (Flamechargerr)** - [GitHub](https://github.com/Flamechargerr)

---

## ✨ Features

### 🎮 Gameplay
- **5 Challenging Levels** - Progressive difficulty with more zombies
- **Day & Night Modes** - Different themes affect sun spawning
- **Save & Load** - Save your progress and continue later
- **Multiple Game States** - Win screen, lose screen, pause menu

### 🌱 Plants Available
| Plant | Cost | Description |
|-------|------|-------------|
| 🌻 **Sunflower** | 50 | Produces sun for planting |
| 🌱 **Pea Shooter** | 100 | Shoots peas at zombies |
| 🥜 **Wall-nut** | 50 | High health defensive barrier |
| 🍒 **Cherry Bomb** | 150 | Explodes and kills nearby zombies |
| 🌱🌱 **Repeater** | 200 | Shoots two peas at once |
| 🌶️ **Jalapeno** | 125 | Burns entire row of zombies |

### 🧟 Zombies
| Zombie | Health | Speed |
|--------|--------|-------|
| 🧟 **Normal Zombie** | Low | Normal |
| 🧟‍♂️ **Conehead Zombie** | Medium | Normal |
| 🧟‍♀️ **Buckethead Zombie** | High | Slow |

### 🛠️ Tools
- **Shovel** - Remove plants from the lawn
- **Almanac** - View details about plants and zombies
- **Progress Bar** - Track level completion

### 🔊 Sound Effects
- Background music
- Planting sounds
- Zombie groans
- Explosion effects
- Victory/Defeat sounds

---

## 📸 Screenshots

<div align="center">

### Main Menu
![Main Menu](screenshots/1.png)

### Gameplay - Day Mode
![Gameplay Day](screenshots/2.png)

### Gameplay - Night Mode
![Gameplay Night](screenshots/3.png)

### Level Selection
![Level Select](screenshots/4.png)

### Battle Arena
![Arena](screenshots/Arena.png)

</div>

---

## 🚀 Installation

### Prerequisites
- **Java JDK 11+** - [Download from Adoptium](https://adoptium.net/)
- **JavaFX SDK 11+** - [Download from Gluon](https://gluonhq.com/products/javafx/)

### Quick Start (Using JAR)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Flamechargerr/flora-fight-frenzy.git
   cd flora-fight-frenzy
   ```

2. **Download JavaFX SDK** from [Gluon](https://gluonhq.com/products/javafx/)

3. **Run the game**
   
   **Windows:**
   ```powershell
   java --module-path "PATH_TO_JAVAFX\lib" --add-modules javafx.controls,javafx.fxml,javafx.graphics,javafx.media -jar jar/PlantVsZombies.jar
   ```
   
   **Linux/Mac:**
   ```bash
   java --module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.fxml,javafx.graphics,javafx.media -jar jar/PlantVsZombies.jar
   ```

### Run from Source

1. **Open in your IDE** (IntelliJ IDEA, Eclipse, NetBeans)
2. **Add JavaFX to your project libraries**
3. **Set VM options:**
   ```
   --module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.fxml,javafx.graphics,javafx.media
   ```
4. **Run `Main.java`**

---

## 🎯 How to Play

### Objective
Defend your house from waves of zombies by strategically placing plants!

### Controls
| Action | How To |
|--------|--------|
| **Select Plant** | Click on plant card in sidebar |
| **Place Plant** | Click on lawn grid |
| **Collect Sun** | Click on falling/produced sun |
| **Remove Plant** | Click shovel, then click plant |
| **Open Menu** | Click "Menu" button |
| **View Almanac** | Click book icon in main menu |

### Strategy Tips
1. 🌻 **Start with Sunflowers** - Plant 2-3 sunflowers first for economy
2. 🌱 **Defense Line** - Place shooters in front rows
3. 🥜 **Use Wall-nuts** - Block zombies while shooters attack
4. 🍒 **Save Cherry Bombs** - Use for emergencies when overwhelmed
5. 🌶️ **Jalapeno for rows** - Clear entire lane when needed

---

## 📁 Project Structure

```
flora-fight-frenzy/
├── src/
│   └── sample/
│       ├── Main.java              # Application entry point
│       ├── GamePlayController.java # Main game logic
│       ├── Plant.java             # Base plant class
│       ├── Zombie.java            # Base zombie class
│       ├── Level.java             # Level management
│       ├── Sunflower.java         # Sunflower plant
│       ├── PeaShooter.java        # Pea shooter plant
│       ├── Repeater.java          # Repeater plant
│       ├── Wallnut.java           # Wall-nut plant
│       ├── CherryBomb.java        # Cherry bomb plant
│       ├── Jalapeno.java          # Jalapeno plant
│       ├── NormalZombie.java      # Normal zombie
│       ├── ConeZombie.java        # Conehead zombie
│       ├── BucketZombie.java      # Buckethead zombie
│       ├── Shovel.java            # Shovel tool
│       ├── LawnMower.java         # Lawnmower defense
│       ├── *.fxml                 # UI layouts
│       └── assets/                # Images & sounds
├── jar/
│   ├── PlantVsZombies.jar         # Executable JAR
│   ├── run_game.bat               # Windows launcher
│   └── README.md                  # JAR instructions
├── screenshots/                   # Game screenshots
├── README.md                      # This file
└── LICENSE                        # GPL v3 License
```

---

## 🎨 Design Patterns Used

1. **Singleton Pattern** - Database and Shovel classes
2. **Iterator Pattern** - Synchronized access to Plants, Zombies, Lawnmowers
3. **Facade Pattern** - Menu-based navigation system
4. **Factory Pattern** - Zombie spawning based on level

---

## 🙏 Credits

| Role | Name |
|------|------|
| **Developer** | [Anamay (Flamechargerr)](https://github.com/Flamechargerr) |
| **Original Concept** | PopCap Games / EA |
| **Original Java Implementation** | Bhavya Chopra & Sonali Singhal |
| **Technology** | Java 17, JavaFX 17 |

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use this code for educational purposes
- ✅ Modify and distribute under the same license
- ✅ Use for non-commercial purposes

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

<div align="center">

### 🌻 Made with ❤️ by Anamay (Flamechargerr) 🧟

[![GitHub](https://img.shields.io/badge/GitHub-Flamechargerr-black?logo=github)](https://github.com/Flamechargerr)

**Defend your lawn. Defeat the zombies. Have fun!**

</div>
