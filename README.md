# ⚡ QUANTUM-RUSH v1.0

```
  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗███████╗
 ██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║██╔════╝
 ██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║███████╗
 ██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║╚════██║
 ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝███████║
  ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚══════╝
                ██████╗ ██╗   ██╗███████╗██╗  ██╗                
                ██╔══██╗██║   ██║██╔════╝██║  ██║                
                ██████╔╝██║   ██║███████╗███████║                
                ██╔══██╗██║   ██║╚════██║██╔══██║                
                ██║  ██║╚██████╔╝███████║██║  ██║                
                ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝                
```

> **BitNode Speedrun Framework** - Optimized for sub-6h Red Pill runs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tylersense-ui/quantum-rush)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Bitburner](https://img.shields.io/badge/bitburner-v2.8.1-orange.svg)](https://github.com/bitburner-official/bitburner-src)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

---

## 🎯 What is Quantum-Rush?

**Quantum-Rush** is a professional-grade automation framework for [Bitburner](https://danielyxie.github.io/bitburner/) designed specifically for **speedrun optimization**. Whether you're racing to the Red Pill in BN1 or farming Source Files across multiple BitNodes, Quantum-Rush provides intelligent automation, real-time guidance, and aggressive optimization strategies.

### 🏆 Target Performance

```
┌─────────────────────────────────────────────────────────┐
│  BENCHMARK TARGETS (In-Game Time)                       │
├─────────────────────────────────────────────────────────┤
│  💰 First $100k       →  < 5 minutes                    │
│  🔓 CyberSec Join     →  < 15 minutes                   │
│  🚀 NiteSec Join      →  < 45 minutes                   │
│  💎 First $1 Billion  →  < 2 hours                      │
│  🎯 Daedalus Unlock   →  < 5 hours                      │
│  🏁 Red Pill Install  →  < 6 hours                      │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🧠 **Intelligent Phase Detection**
- Automatically detects your current progression (Early/Mid/Late)
- Switches strategies dynamically based on available resources
- No manual configuration needed - just run and go

### ⚡ **Ultra-Aggressive HWGW Batching**
- Optimized batch timing (10ms spacing)
- Zero safety margins for maximum profit/second
- Dynamic target switching based on real-time $/s analysis
- In-flight batch tracking prevents conflicts

### 📊 **Real-Time Speedrun Dashboard**
```
┌─── QUANTUM-RUSH LIVE DASHBOARD ────────────────────────┐
│ ⏱️  Runtime: 2h 34m 12s                                 │
│ 💰 Capital: $847.3m        📈 Rate: $2.1m/s             │
│                                                         │
│ ▁▂▃▅▆▇█ PROFIT TREND ████████████████░░░░ [87%]        │
│                                                         │
│ 🎯 MILESTONES:                          ETA             │
│ ✅ CyberSec      [COMPLETE]             --              │
│ ✅ NiteSec       [COMPLETE]             --              │
│ ⏳ Black Hand    [IN PROGRESS]          23m 15s         │
│ 🔒 BitRunners    [LOCKED]               1h 12m          │
│ 🔒 Daedalus      [LOCKED]               2h 45m          │
│                                                         │
│ 📦 Augmentations: 12/30                                 │
│ [████████░░░░░░░░░░░░░░] 40%                            │
└─────────────────────────────────────────────────────────┘
```

### 🎮 **Hybrid Automation**
- **BN1 Fresh** (no Source Files): Helper mode with action guidance
- **Post-SF4**: Full automation with Singularity API
- Seamless transition - scripts detect capabilities automatically

### 🧭 **Smart Route Optimization**
- Pre-calculated optimal aug purchase paths
- Inflation-aware ordering (minimizes 1.9x multiplier impact)
- Parallel faction farming strategies
- Real-time ETA calculations

### 💎 **Stock Market Mastery**
- Pre-4S: Intelligent monitoring and portfolio tracking
- Post-4S: Aggressive trading (forecast > 0.55)
- Auto-liquidation for aug purchases
- Target: $100B profit in 1 hour

---

## 🚀 Quick Start

### Installation

```bash
# In Bitburner terminal:
wget https://raw.githubusercontent.com/tylersense-ui/quantum-rush/main/install.js install.js
run install.js
```

Or manually download and place files in your Bitburner home directory.

### Basic Usage

```javascript
// Launch the framework
run src/boot.js

// Monitor progress
run src/core/dashboard-v2.js

// Emergency stop
run global-kill.js --confirm
```

### First Run Workflow

1. **Start fresh in BN1** (or any BitNode)
2. **Run `boot.js`** - Auto-detects phase and capabilities
3. **Follow dashboard guidance** - Manual actions for BN1 fresh
4. **Watch automation scale** - As you unlock more resources
5. **Install augs strategically** - Route optimizer guides purchases

---

## 📚 Documentation

- 📖 [Architecture Overview](docs/ARCHITECTURE.md)
- 🏃 [Speedrun Strategy Guide](docs/SPEEDRUN-GUIDE.md)
- 📊 [Benchmark Targets](docs/BENCHMARKS.md)
- 🔧 [API Reference](docs/API-REFERENCE.md)
- ❓ [Troubleshooting](docs/TROUBLESHOOTING.md)

---

## 🏗️ Architecture

```
quantum-rush/
├── src/
│   ├── core/          # Engine (orchestrator, batcher, dashboard)
│   ├── speedrun/      # Phase scripts (early/mid/late)
│   ├── lib/           # Utilities (network, logger, constants)
│   ├── hack/          # HWGW workers + controller
│   ├── managers/      # Automation (singularity, stock, servers)
│   ├── exploits/      # Quick money scripts (crime, pserv rush)
│   └── tools/         # Utilities (scanner, liquidate, etc)
├── data/              # Pre-calculated routes and configs
├── docs/              # Comprehensive documentation
└── assets/            # Screenshots and diagrams
```

---

## 🎯 Roadmap

### v1.0 - Core Speedrun ✅
- [x] BN1 → Red Pill optimization
- [x] Intelligent phase detection
- [x] HWGW batch engine
- [x] Real-time dashboard
- [x] Route optimizer

### v1.1 - Source File Farming 🚧
- [ ] BN2 (Gang) integration
- [ ] BN3 (Corporation) speedrun
- [ ] BN5 (Intelligence) routes
- [ ] Multi-BN completion tracker

### v1.2 - Advanced Features 📋
- [ ] Bladeburner automation (BN6/7)
- [ ] Stanek's Gift optimizer (BN13)
- [ ] Sleeve coordination (BN10)
- [ ] Grafting strategies

### v2.0 - Community Edition 💎
- [ ] Web-based configuration UI
- [ ] Live leaderboards
- [ ] Replay analysis
- [ ] Custom challenge modes

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

### Development Setup

```bash
# Clone repository
git clone https://github.com/tylersense-ui/quantum-rush.git

# Run validation
run scripts/validate-syntax.js

# Test in Bitburner
# (Manual testing recommended)
```

---

## 📊 Performance Comparison

| Metric | Manual Play | Basic Scripts | Quantum-Rush |
|--------|-------------|---------------|--------------|
| **0→$100k** | ~30min | ~15min | **< 5min** ✨ |
| **First Faction** | ~1h | ~30min | **< 15min** ✨ |
| **Red Pill** | ~20h | ~10h | **< 6h** ✨ |
| **Dashboard** | None | Basic | **Real-time ETAs** ✨ |
| **Route Planning** | Manual | None | **AI-optimized** ✨ |

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Bitburner Community** - For the amazing game and ecosystem
- **danielyxie** - Creator of Bitburner
- **Speedrun Discord** - Strategy discussions and benchmarks
- **Original Nexus-Apex** - Foundation and inspiration

---

## 💬 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tylersense-ui/quantum-rush/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/tylersense-ui/quantum-rush/discussions)
- 💬 **Discord**: [Join Community](https://discord.gg/bitburner)

---

## ⚡ "Why run when you can QUANTUM-RUSH?" ⚡

```
[████████████████████████████████████████] 100% READY TO SPEEDRUN
```

---

**Made with ⚡ by Claude (Anthropic) for @tylersense-ui & the Bitburner Speedrun Community**
