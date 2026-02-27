# 📜 Changelog

All notable changes to **Quantum-Rush** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🚀 Planned
- Multi-BitNode completion tracker
- Bladeburner automation (BN6/7)
- Stanek's Gift optimizer (BN13)
- Web-based configuration UI
- Live leaderboard integration

---

## [1.0.0] - 2025-02-27

### 🎉 Initial Release - "The Quantum Leap"

> **First stable release of Quantum-Rush** - A complete rewrite and optimization of automation frameworks for Bitburner speedrunning.

### ✨ Added - Core Features

#### 🧠 **Intelligence Layer**
- **Phase Detection System** - Automatically detects Early/Mid/Late game phases
- **Smart Route Optimizer** - Pre-calculated optimal augmentation purchase paths
- **Faction Router** - Intelligent faction work prioritization
- **Milestone Tracker** - Real-time ETA calculations for all major objectives
- **Capability Detection** - Automatic Source File detection and feature gating

#### ⚡ **Automation Engine**
- **HWGW Batch Engine v2** - Ultra-aggressive batching with 10ms spacing
- **In-Flight Tracker** - Prevents batch conflicts with live thread monitoring
- **Dynamic Target Switching** - Real-time $/s optimization
- **Smart Preparation** - Aggressive weaken/grow strategies for new targets
- **Zero Safety Margins** - Maximum profit mode for speedrun optimization

#### 📊 **Monitoring & UI**
- **Speedrun Dashboard** - Real-time progress tracking with:
  - ⏱️ Runtime timer (in-game time)
  - 💰 Capital tracking with $/s rate
  - ▁▂▃▅▆▇█ Profit sparklines
  - 🎯 Milestone progress with ETAs
  - [████████░░] Visual progress bars
  - 📦 Augmentation counter (X/30 for Daedalus)
- **Network Watcher** - Live server status monitoring
- **Performance Metrics** - Real-time profit/sec, XP/sec, RAM usage

#### 🚀 **Speedrun Phases**
- **Early Rush (0→$100k)** - Optimized crime + hacking hybrid
- **Mid Scaling ($100k→$1B)** - HWGW batch + Stock market integration
- **Late Push ($1B→Red Pill)** - Full automation + aug purchase optimization

#### 💎 **Stock Market**
- **Pre-4S Mode** - Portfolio monitoring and tracking
- **Post-4S Mode** - Aggressive trading (forecast > 0.55)
- **Auto-Liquidation** - Smart selling for augmentation purchases
- **Profit Target** - $100B in 1 hour optimization

#### 🔧 **Managers (SF-Aware)**
- **Singularity Manager** - Auto-crime, faction work, aug purchases (requires SF4)
- **Stock Master** - Full stock market automation (requires TIX + 4S APIs)
- **Server Manager** - Aggressive pserver purchasing and upgrading
- **Hacknet Manager** - Passive income optimization
- **Gang Manager** - Full gang automation (requires SF2, BN2)
- **Corporation Manager** - Basic corp automation (requires SF3, BN3)
- **Sleeve Manager** - Clone coordination (requires SF10)
- **Program Manager** - Automatic TOR + crack program purchases

#### 🎯 **Exploits & Tools**
- **Crime Rush** - Optimized crime grinding (SF4-aware)
- **Pserver Rush** - Early RAM spam strategy
- **Scanner** - Network analysis with $/s ranking
- **Liquidate** - Emergency stock portfolio sell-off
- **Set Share** - Faction reputation boost control

#### 📚 **Architecture**
- **Modular Design** - Clean separation: core/lib/speedrun/managers
- **BN1-Safe** - Full compatibility without any Source Files
- **SF-Progressive** - Unlocks more automation as SFs are acquired
- **Port-Based IPC** - Efficient inter-script communication
- **RAM Manager** - Smart memory allocation across network
- **Logger System** - Color-coded, categorized logging

### 🎨 Added - Polish & UX
- **ASCII Art Logo** - Professional QUANTUM-RUSH branding
- **Color-Coded Output** - ANSI colors for terminal clarity
- **Icon-Rich UI** - Extensive use of emoji for visual clarity
- **Progress Bars** - Visual feedback for long operations
- **Sparklines** - Trend visualization in real-time
- **Smart Formatting** - Human-readable numbers, times, percentages

### 📖 Added - Documentation
- **README.md** - Comprehensive project overview with:
  - Features showcase
  - Benchmark targets
  - Quick start guide
  - Performance comparison table
  - Roadmap (v1.0 → v2.0)
- **CHANGELOG.md** - This file
- **Architecture documentation** (planned)
- **API reference** (planned)
- **Speedrun strategy guide** (planned)

### 🔧 Technical Details

#### Performance Optimizations
- Batch spacing reduced: 30ms → 10ms (3x faster cycles)
- RAM caching: Network scan results cached for 5 cycles
- In-flight tracking: Zero batch conflicts
- Target scoring: Formula-based when available, fallback to native

#### Compatibility
- **Bitburner**: v2.8.1+
- **BitNodes**: All (BN1-14)
- **Source Files**: Optional (0+ required, features unlock progressively)
- **RAM Requirements**: 64GB minimum recommended (32GB possible)

#### Key Constants
```javascript
VERSION: "1.0.0"
BATCH_SPACING: 10ms (speedrun mode)
RESERVED_HOME_RAM: 64GB
TARGET_RED_PILL: < 6 hours (in-game)
```

### 🐛 Fixed
- N/A (initial release)

### 🔒 Security
- No external dependencies
- No data collection
- No network calls outside game API
- Safe for use in all environments

### 📦 Data Files
- **augmentations.json** - Pre-processed augmentation database
- **speedrun-routes.json** - Optimal faction/aug paths
- **milestones.json** - Benchmark targets and thresholds

---

## [0.9.0] - 2025-02-20 (Beta)

### 🧪 Beta Testing Phase

#### Added
- Core engine prototype
- Basic HWGW implementation
- Early dashboard prototype
- Initial manager scripts

#### Changed
- Refactored from Nexus-Apex v1.x codebase
- Complete rewrite for speedrun focus
- Renamed project to Quantum-Rush

#### Fixed
- Memory leaks in batch controller
- Port communication deadlocks
- Dashboard refresh rate issues

---

## [0.5.0] - 2025-02-10 (Alpha)

### 🔬 Alpha Development

#### Added
- Project inception
- Core architecture design
- Proof-of-concept scripts
- Initial testing framework

---

## Version History Summary

| Version | Codename | Date | Focus |
|---------|----------|------|-------|
| **1.0.0** | **The Quantum Leap** | 2025-02-27 | ✅ Stable Release |
| 0.9.0 | Beta Rush | 2025-02-20 | 🧪 Beta Testing |
| 0.5.0 | Alpha Dawn | 2025-02-10 | 🔬 Proof of Concept |

---

## Upgrade Guide

### From Beta (0.9.0) to Stable (1.0.0)

```bash
# Backup your current setup
cp -r quantum-rush quantum-rush-backup

# Pull latest version
cd quantum-rush
git pull origin main

# Restart framework
run global-kill.js --confirm
run src/boot.js
```

**⚠️ Breaking Changes**: None (1.0.0 is backwards compatible with 0.9.0)

---

## Support & Contributing

### 📢 Release Notes
- [GitHub Releases](https://github.com/tylersense-ui/quantum-rush/releases)
- [Full Changelog](https://github.com/tylersense-ui/quantum-rush/blob/main/CHANGELOG.md)

### 🐛 Report Issues
- [Bug Tracker](https://github.com/tylersense-ui/quantum-rush/issues)
- [Feature Requests](https://github.com/tylersense-ui/quantum-rush/discussions)

### 🤝 Contribute
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

---

## Legend

- ✨ **Added** - New features
- 🔧 **Changed** - Changes in existing functionality  
- 🗑️ **Deprecated** - Soon-to-be removed features
- 🐛 **Fixed** - Bug fixes
- 🔒 **Security** - Vulnerability fixes
- 📚 **Documentation** - Documentation updates

---

**⚡ "Every version brings us closer to the speed of light" ⚡**

---

[Unreleased]: https://github.com/tylersense-ui/quantum-rush/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tylersense-ui/quantum-rush/releases/tag/v1.0.0
[0.9.0]: https://github.com/tylersense-ui/quantum-rush/releases/tag/v0.9.0
[0.5.0]: https://github.com/tylersense-ui/quantum-rush/releases/tag/v0.5.0
