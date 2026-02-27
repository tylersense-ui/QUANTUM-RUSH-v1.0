# 🏗️ Quantum-Rush Architecture

> **Technical Design Document v2.0**  
> Last Updated: 2025-02-27  
> Author: Claude (Anthropic) for @tylersense-ui

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [System Architecture](#system-architecture)
4. [Module Breakdown](#module-breakdown)
5. [Data Flow](#data-flow)
6. [Communication Patterns](#communication-patterns)
7. [Phase Detection System](#phase-detection-system)
8. [HWGW Batch Engine](#hwgw-batch-engine)
9. [Source File Awareness](#source-file-awareness)
10. [Performance Optimizations](#performance-optimizations)
11. [Error Handling](#error-handling)
12. [Extensibility](#extensibility)

---

## 🎯 Overview

**Quantum-Rush** is a modular, phase-aware automation framework for Bitburner speedrunning. The architecture is designed around three core principles:

1. **Progressive Complexity** - Starts simple (BN1 fresh), scales with Source Files
2. **Intelligent Adaptation** - Detects game phase and adjusts strategies automatically
3. **Maximum Performance** - Optimized for sub-6h Red Pill runs

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Dashboard  │  │   Milestone  │  │   Network Watcher   │   │
│  │   (Main)    │  │    Tracker   │  │   (Secondary)       │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘   │
└─────────┼─────────────────┼────────────────────┼───────────────┘
          │                 │                    │
┌─────────┼─────────────────┼────────────────────┼───────────────┐
│         │        CORE ENGINE (Orchestrator)    │               │
│  ┌──────▼─────┐  ┌────────▼────────┐  ┌───────▼────────┐     │
│  │   Phase    │  │   Capability    │  │   Port         │     │
│  │  Detector  │  │    Detector     │  │   Handler      │     │
│  └────────────┘  └─────────────────┘  └────────────────┘     │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                    AUTOMATION LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐    │
│  │   Speedrun  │  │    HWGW     │  │     Managers       │    │
│  │   Scripts   │  │   Batcher   │  │  (Singularity,    │    │
│  │ (Early/Mid/ │  │  (Profit    │  │   Stock, Server,  │    │
│  │    Late)    │  │   Engine)   │  │   etc.)           │    │
│  └─────────────┘  └─────────────┘  └────────────────────┘    │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                    EXECUTION LAYER                             │
│  ┌─────────────────────────▼────────────────────────────┐     │
│  │              Worker Controller                       │     │
│  │  (Dispatcher - Command Queue Processing)            │     │
│  └─────────────┬───────────┬──────────┬─────────────────┘     │
│                │           │          │                        │
│    ┌───────────▼──┐  ┌────▼─────┐  ┌─▼─────────┐            │
│    │  hack.js     │  │ grow.js  │  │ weaken.js │  (Workers) │
│    │  (Atomic)    │  │ (Atomic) │  │ (Atomic)  │            │
│    └──────────────┘  └──────────┘  └───────────┘            │
└───────────────────────────────────────────────────────────────┘
```

---

## 💡 Design Philosophy

### 1. **Separation of Concerns**

Each module has a single, well-defined responsibility:

- **Core** - Engine logic (orchestration, batching, ports)
- **Lib** - Pure utilities (no game state)
- **Speedrun** - Phase-specific strategies
- **Hack** - Low-level execution (workers + controller)
- **Managers** - High-level automation (SF-dependent)

### 2. **Progressive Enhancement**

```
BN1 Fresh (0 SF)
├─ Core engine works
├─ Manual actions via dashboard guidance
└─ HWGW automation active

BN1 + SF4 (Singularity)
├─ Everything from BN1
├─ Auto-crime, auto-faction work
└─ Auto-aug purchases

BN1 + SF4 + SF8 (Stock)
├─ Everything from BN1 + SF4
└─ Aggressive stock trading

Post-BitNode Completion
├─ All features unlocked
└─ Full automation across all systems
```

### 3. **Data-Driven Configuration**

All thresholds, targets, and parameters are centralized in `constants.js`:
- No magic numbers in code
- Easy tuning for different strategies
- Clear documentation of each value

### 4. **Fail-Safe Design**

```javascript
try {
    ns.singularity.workForFaction("CyberSec");
} catch (e) {
    // Graceful degradation - show manual instructions
    dashboard.showAction("Work for CyberSec manually");
}
```

Every SF-dependent feature has a fallback.

---

## 🏛️ System Architecture

### Directory Structure

```
quantum-rush/
│
├── src/
│   ├── boot.js                 # Entry point - launches orchestrator
│   ├── global-kill.js          # Emergency stop
│   │
│   ├── core/                   # Core engine
│   │   ├── orchestrator.js     # Main coordinator
│   │   ├── batcher-v2.js       # HWGW profit engine
│   │   ├── dashboard-v2.js     # Main UI
│   │   ├── milestone-tracker.js # Speedrun progress
│   │   ├── port-handler.js     # IPC abstraction
│   │   └── ram-manager.js      # Memory allocation
│   │
│   ├── lib/                    # Utilities
│   │   ├── capabilities.js     # SF detection
│   │   ├── network.js          # Server scanning/scoring
│   │   ├── constants.js        # Configuration hub
│   │   ├── logger.js           # Logging system
│   │   └── utils.js            # Helper functions
│   │
│   ├── speedrun/               # Phase-specific scripts
│   │   ├── phase-detector.js   # Auto-detect current phase
│   │   ├── early-rush.js       # 0→$100k strategy
│   │   ├── mid-scaling.js      # $100k→$1B strategy
│   │   ├── late-push.js        # $1B→Red Pill strategy
│   │   ├── aug-optimizer.js    # Purchase path calculator
│   │   └── faction-router.js   # Work prioritization
│   │
│   ├── hack/                   # Hacking automation
│   │   ├── controller.js       # Worker dispatcher
│   │   ├── watcher.js          # Network monitor
│   │   └── workers/
│   │       ├── hack.js         # Atomic hack operation
│   │       ├── grow.js         # Atomic grow operation
│   │       ├── weaken.js       # Atomic weaken operation
│   │       └── share.js        # Reputation boost
│   │
│   ├── managers/               # High-level automation
│   │   ├── singularity-v2.js   # Player actions (SF4)
│   │   ├── stock-master-v2.js  # Stock trading (SF8)
│   │   ├── server-manager-v2.js # Pserver purchasing
│   │   ├── hacknet-manager.js  # Passive income
│   │   ├── gang-manager.js     # Gang automation (SF2)
│   │   ├── sleeve-manager.js   # Clone management (SF10)
│   │   ├── corp-manager.js     # Corporation (SF3)
│   │   └── program-manager.js  # TOR + crack tools
│   │
│   ├── exploits/               # Quick money scripts
│   │   ├── crime-rush.js       # Optimized crime grinding
│   │   ├── pserv-rush.js       # Early RAM acquisition
│   │   └── casino-helper.js    # Casino optimization
│   │
│   └── tools/                  # Utilities
│       ├── scanner.js          # Network analysis
│       ├── set-share.js        # Rep boost control
│       ├── liquidate.js        # Emergency stock sell
│       └── performance-test.js # Benchmarking
│
└── data/                       # Pre-calculated data
    ├── augmentations.json      # Aug database
    ├── speedrun-routes.json    # Optimal paths
    └── milestones.json         # Target times
```

---

## 🔧 Module Breakdown

### Core Modules

#### 1. **orchestrator.js** - System Coordinator

**Responsibilities:**
- Launch all managers and systems
- Maintain network access (persistent rooting)
- Monitor system health
- Handle startup sequence

**Key Functions:**
```javascript
main(ns)
├─ Initialize capabilities detection
├─ Launch phase-appropriate modules
├─ Start heartbeat loop
└─ Monitor for crashed processes
```

**Dependencies:**
- `lib/capabilities.js` - SF detection
- `lib/network.js` - Server scanning
- All manager modules

---

#### 2. **batcher-v2.js** - HWGW Profit Engine

**Responsibilities:**
- Execute coordinated HWGW batches
- Manage in-flight batch tracking
- Optimize target selection
- Handle preparation phases

**Architecture:**
```
Batch Cycle:
┌─────────────────────────────────────────┐
│ 1. Select Target (best $/s)            │
│    ├─ Check if prepped                 │
│    └─ If not → Prep Phase              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ 2. Calculate Batch Composition         │
│    ├─ Hack threads (15% of money)      │
│    ├─ Weaken1 threads (counter hack)   │
│    ├─ Grow threads (restore money)     │
│    └─ Weaken2 threads (counter grow)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ 3. Calculate Timing Delays              │
│    ├─ Weaken finishes last (reference) │
│    ├─ Hack finishes 10ms before        │
│    ├─ Weaken1 finishes on time         │
│    ├─ Grow finishes 10ms after         │
│    └─ Weaken2 finishes 20ms after      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ 4. Dispatch to Controller               │
│    ├─ Send commands via port            │
│    ├─ Track in-flight batches          │
│    └─ Wait for batch spacing (10ms)    │
└─────────────────────────────────────────┘
```

**Key Optimizations:**
- **10ms spacing** (vs 30ms standard) = 3x throughput
- **In-flight tracking** prevents batch conflicts
- **Dynamic target switching** every 30s
- **Zero safety margins** (aggressive mode)

---

#### 3. **dashboard-v2.js** - Speedrun UI

**Responsibilities:**
- Display real-time speedrun progress
- Show milestone ETAs
- Visualize profit trends (sparklines)
- Alert if behind pace

**Layout:**
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
│ [████████░░░░░░░░░░░░] 40%                              │
│                                                         │
│ 🖥️  Network: 15 servers | 512GB / 2TB (25%)            │
│ ⚙️  Threads: H:15.2k G:23.8k W:31.5k S:0               │
└─────────────────────────────────────────────────────────┘
```

**Update Cycle:**
- Refresh: 1000ms (1 second)
- Cache server data for 5 cycles (reduce CPU)
- Sparkline: Last 20 profit samples

---

#### 4. **milestone-tracker.js** - Progress Calculator

**Responsibilities:**
- Calculate ETA for each milestone
- Detect if behind pace
- Trigger alerts when critical
- Suggest corrective actions

**Algorithm:**
```javascript
For each milestone:
1. Get target time from constants
2. Calculate current progress (0-1)
3. Estimate completion time based on current rate
4. Compare with target
5. If behind > 20% → Warning
6. If behind > 40% → Critical alert
```

---

### Library Modules

#### 1. **capabilities.js** - SF Detection

**Purpose:** Detect available Source Files and APIs

**Detection Logic:**
```javascript
// Singularity (SF4)
try {
    ns.singularity.getOwnedAugmentations();
    this.singularity = true;
} catch (e) {
    this.singularity = false;
}

// Stock Market (SF8)
try {
    this.tix = ns.stock.hasTIXAPIAccess();
    this.has4S = ns.stock.has4SDataAPIAccess();
} catch (e) {
    this.tix = false;
    this.has4S = false;
}

// Formulas (Formulas.exe)
this.formulas = ns.fileExists("Formulas.exe", "home");
```

**Used By:** Every module that needs SF-dependent features

---

#### 2. **network.js** - Server Management

**Responsibilities:**
- Scan entire network
- Calculate server profitability scores
- Crack servers (nuke)
- Maintain topology cache

**Scoring Algorithm:**
```javascript
// Without Formulas.exe (BN1 safe)
score = server.moneyMax / server.minDifficulty

// With Formulas.exe (more accurate)
score = server.moneyMax / ns.formulas.hacking.weakenTime(server, player)
```

**Cache Strategy:**
- Network topology: Refresh every 60s
- Server scores: Recalculate every 30s
- Speeds up target selection significantly

---

#### 3. **constants.js** - Configuration Hub

All game parameters in one place:
- Milestone targets
- Batch settings
- Stock thresholds
- Server budgets
- UI colors/icons

**Benefits:**
- Easy tuning without code changes
- Clear documentation of all values
- Enables A/B testing strategies

---

### Speedrun Modules

#### 1. **phase-detector.js** - Game Phase Detection

**Phases:**
```javascript
EARLY: money < $100k, level < 50
├─ Strategy: Crime + basic hacking
├─ Goal: Get first pservers
└─ Key milestone: Join CyberSec

MID: $100k < money < $1B, level < 200
├─ Strategy: HWGW batching + stock market
├─ Goal: Unlock 4S Data, farm rep
└─ Key milestone: Join BitRunners

LATE: money > $1B, level > 200
├─ Strategy: Full automation
├─ Goal: 30 augs → Daedalus → Red Pill
└─ Key milestone: Install Red Pill
```

**Detection Logic:**
```javascript
function detectPhase(player, servers) {
    if (player.money < 100000 || player.hacking < 50) {
        return "early";
    }
    if (player.money < 1e9 || player.hacking < 200) {
        return "mid";
    }
    return "late";
}
```

---

#### 2. **aug-optimizer.js** - Purchase Path Calculator

**Problem:** Augmentation inflation (1.9x multiplier per purchase)

**Solution:** Buy cheapest augs first, expensive ones last

**Algorithm:**
```javascript
1. Load all relevant augs from database
2. Filter by faction route (CyberSec → Daedalus)
3. Sort by price (ascending)
4. Group into batches of 10 (max per install)
5. Calculate total cost with inflation
6. Output purchase order

Example:
Batch 1 (10 augs): $50m → $95m (inflation)
Batch 2 (10 augs): $2b → $3.8b (inflation)
Batch 3 (10 augs): $50b → $95b (inflation)
```

---

### Execution Layer

#### **controller.js** - Worker Dispatcher

**Responsibilities:**
- Read commands from port queue
- Dispatch to appropriate workers
- Track running processes
- Handle execution failures

**Command Format:**
```javascript
{
    type: "hack" | "grow" | "weaken" | "share",
    host: "server-to-run-on",
    target: "server-to-target",
    threads: 100,
    delay: 5000  // ms delay before execution
}
```

**Execution Flow:**
```
1. Read command from COMMANDS port
2. Validate command structure
3. Check if host has root access
4. Copy worker script if needed (cache deployed hosts)
5. Execute: ns.exec(script, host, threads, target, delay, uuid)
6. Track PID for monitoring
7. Loop (no sleep - continuous processing)
```

**Optimization:** Zero-sleep loop for instant dispatch

---

## 📡 Data Flow

### Port-Based Communication

**Why Ports?**
- Fast IPC (no file I/O)
- Decoupled modules
- Non-blocking communication

**Port Map:**
```javascript
PORT 1: Network topology cache
PORT 2: HWGW target queue
PORT 3: Centralized logging
PORT 4: Worker commands (high-traffic)
PORT 5: Stock market data
PORT 6: Share ratio control
PORT 7: Milestone progress
PORT 8: Phase state
```

### Example: HWGW Batch Dispatch

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Batcher    │──(4)─>│  Controller  │──exec>│   Workers    │
└──────────────┘       └──────────────┘       └──────────────┘
     │                        │                       │
     │ Calculate batch        │                       │
     │ Send 4 commands        │ Read commands         │
     │ (H/W/G/W)             │ Dispatch threads      │
     │                        │                       │
     └──(7)──────────────────┴───────────────────────┘
           Update milestone progress
```

---

## 🎯 Phase Detection System

### Dynamic Strategy Switching

```javascript
// In orchestrator.js
while (true) {
    const phase = detectPhase(ns);
    
    if (phase !== currentPhase) {
        // Phase transition detected
        ns.print(`Phase change: ${currentPhase} → ${phase}`);
        
        // Stop old phase scripts
        stopPhaseScripts(currentPhase);
        
        // Start new phase scripts
        startPhaseScripts(phase);
        
        currentPhase = phase;
    }
    
    await ns.sleep(60000); // Check every minute
}
```

### Phase-Specific Scripts

**Early Phase** (`speedrun/early-rush.js`):
- Focus: Fast money ($0 → $100k)
- Crime grinding if no SF4
- Basic hack (n00dles, joesguns)
- Buy first pservers

**Mid Phase** (`speedrun/mid-scaling.js`):
- Focus: Scale to $1B
- Launch HWGW batcher
- Buy TIX API → 4S Data
- Farm faction rep

**Late Phase** (`speedrun/late-push.js`):
- Focus: 30 augs → Red Pill
- Full automation
- Aug purchase optimization
- Final push to Daedalus

---

## ⚡ HWGW Batch Engine

### Batch Composition

A single HWGW batch consists of 4 operations executed in precise order:

```
Operation | Threads | Time      | Effect
----------|---------|-----------|---------------------------
Hack      | H       | ~15s      | Steal 15% of money
Weaken    | W1      | ~30s      | Counter hack sec increase
Grow      | G       | ~20s      | Restore stolen money
Weaken    | W2      | ~30s      | Counter grow sec increase
```

### Timing Coordination

**Goal:** All operations land in perfect sequence

```
Timeline (example):
T=0s     : Launch all 4 operations with delays
T=14.99s : Hack lands (steals money)
T=15.00s : Weaken1 lands (fixes security)
T=15.01s : Grow lands (restores money)
T=15.02s : Weaken2 lands (fixes security)

Result: Server is in identical state, but we gained money
```

**Delay Calculation:**
```javascript
const wTime = ns.getWeakenTime(target);  // Longest (reference)
const gTime = ns.getGrowTime(target);
const hTime = ns.getHackTime(target);

const delays = {
    hack:    wTime - hTime - BATCH_SPACING,
    weaken1: 0,  // Launches immediately
    grow:    wTime - gTime + BATCH_SPACING,
    weaken2: BATCH_SPACING * 2
};
```

### In-Flight Tracking

**Problem:** Multiple batches running simultaneously can conflict

**Solution:** Track all running operations

```javascript
const inFlight = {
    "n00dles": {
        hackThreads: 1500,
        growThreads: 2300,
        weakenThreads: 3800
    },
    "foodnstuff": { ... }
};

// Before dispatching new batch:
if (inFlight[target].hackThreads > 0) {
    // Wait for previous batch to complete
    return;
}
```

---

## 🔒 Source File Awareness

### Progressive Feature Unlocking

```javascript
// Example: Singularity Manager
export async function main(ns) {
    const caps = new Capabilities(ns);
    
    if (!caps.singularity) {
        ns.tprint("⚠️ SF4 required for auto-faction work");
        ns.tprint("📋 Manual actions:");
        ns.tprint("  1. Join CyberSec (Faction tab)");
        ns.tprint("  2. Work Hacking Contracts");
        return; // Graceful exit
    }
    
    // SF4 available - proceed with automation
    while (true) {
        ns.singularity.workForFaction("CyberSec", "Hacking Contracts");
        await ns.sleep(60000);
    }
}
```

### Feature Matrix

| Feature | SF Required | Fallback |
|---------|-------------|----------|
| HWGW Batching | None (BN1) | N/A |
| Stock Trading | SF8 (4S Data) | Portfolio monitoring only |
| Auto Faction Work | SF4 | Dashboard guidance |
| Gang Management | SF2 | Not available |
| Corporation | SF3 | Not available |
| Sleeves | SF10 | Not available |

---

## 🚀 Performance Optimizations

### 1. **Caching Strategy**

```javascript
// Network scan - expensive operation
let networkCache = null;
let cacheAge = 0;

function getNetwork(ns) {
    if (Date.now() - cacheAge < 60000) {
        return networkCache; // Use cached (< 1min old)
    }
    
    networkCache = scanNetwork(ns);
    cacheAge = Date.now();
    return networkCache;
}
```

### 2. **Batch Processing**

Process multiple port commands per tick:

```javascript
// Instead of:
while (true) {
    const cmd = readPort();
    processCommand(cmd);
    await ns.sleep(100);  // Slow!
}

// Do this:
while (true) {
    while (!portEmpty()) {
        const cmd = readPort();
        processCommand(cmd);  // No sleep between commands
    }
    await ns.sleep(20);  // Only sleep when port is empty
}
```

### 3. **RAM Optimization**

```javascript
// Workers are minimal (1.70-1.75 GB each)
// No imports, no dependencies, pure execution

/** @param {NS} ns */
export async function main(ns) {
    const [target, delay] = ns.args;
    if (delay > 0) await ns.sleep(delay);
    await ns.hack(target);
}
```

### 4. **Pre-calculated Data**

Store expensive calculations in JSON files:
- Augmentation paths
- Faction routes
- Milestone targets

Load once at startup instead of recalculating.

---

## 🛡️ Error Handling

### Layered Error Strategy

```javascript
// Layer 1: Input validation
function dispatchBatch(target, threads) {
    if (!target || threads <= 0) {
        log.warn("Invalid batch parameters");
        return false;
    }
    
    // Layer 2: Capability check
    if (!ns.hasRootAccess(target)) {
        log.error(`No root access to ${target}`);
        return false;
    }
    
    // Layer 3: Try-catch execution
    try {
        const pid = ns.exec(script, host, threads);
        if (pid === 0) {
            log.error("Insufficient RAM");
            return false;
        }
        return true;
    } catch (e) {
        log.error(`Execution failed: ${e}`);
        return false;
    }
}
```

### Graceful Degradation

```javascript
// If a manager crashes, others continue
try {
    ns.run("/managers/stock-master-v2.js");
} catch (e) {
    log.warn("Stock manager failed, continuing without it");
}

try {
    ns.run("/managers/singularity-v2.js");
} catch (e) {
    log.warn("Singularity manager failed, manual actions required");
}
```

---

## 🔧 Extensibility

### Adding New Phases

```javascript
// 1. Define phase in constants.js
PHASES: {
    EARLY: { ... },
    MID: { ... },
    LATE: { ... },
    ULTRA_LATE: {  // New phase
        MIN_MONEY: 1e12,  // $1T
        STRATEGY: "post-daedalus-farming"
    }
}

// 2. Create script: speedrun/ultra-late.js
export async function main(ns) {
    // Ultra late game strategy
}

// 3. Add to phase detector
function detectPhase(player) {
    if (player.money > 1e12) return "ultra_late";
    // ... rest of detection
}
```

### Adding New Managers

```javascript
// 1. Create: managers/bladeburner-manager.js
export async function main(ns) {
    if (!ns.bladeburner.inBladeburner()) {
        ns.tprint("Not in Bladeburner");
        return;
    }
    // Manager logic
}

// 2. Add to orchestrator.js
if (caps.bladeburner) {
    modules.push({
        name: "BLADEBURNER",
        path: "/managers/bladeburner-manager.js"
    });
}
```

---

## 📊 Performance Benchmarks

### Target Performance (In-Game Time)

| Milestone | Target | Optimized | Notes |
|-----------|--------|-----------|-------|
| First $10k | 3min | ~2min | Crime grinding |
| First $100k | 5min | ~4min | First pserver |
| CyberSec | 15min | ~12min | Backdoor CSEC |
| First $1M | 20min | ~18min | HWGW active |
| NiteSec | 45min | ~40min | Backdoor avmnite |
| First $100M | 60min | ~55min | Stock boost |
| First $1B | 2h | ~1h50min | 4S trading |
| BitRunners | 4h | ~3h45min | Backdoor run4theh111z |
| Daedalus | 5h30min | ~5h | 30 augs completed |
| Red Pill | 6h | ~5h45min | **Target achieved** |

---

## 🎓 Key Takeaways

### Architecture Principles

1. ✅ **Modularity** - Each component is independent
2. ✅ **Progressive** - Works at any stage (0 SF → all SF)
3. ✅ **Fail-Safe** - Graceful degradation everywhere
4. ✅ **Performance** - Optimized for speed (caching, batching)
5. ✅ **Extensible** - Easy to add new features

### Design Patterns Used

- **Factory Pattern** - Logger, Capabilities detection
- **Strategy Pattern** - Phase-specific scripts
- **Observer Pattern** - Milestone tracking
- **Command Pattern** - Worker dispatch via ports
- **Singleton Pattern** - Configuration (constants.js)

### Trade-offs

| Decision | Pro | Con |
|----------|-----|-----|
| Port-based IPC | Fast, decoupled | Limited to simple data |
| Aggressive batch timing | Maximum $/s | Higher risk of conflicts |
| Minimal workers | Low RAM cost | Less flexibility |
| Centralized config | Easy tuning | Must reload on change |

---

## 🚀 Next Steps

For implementation details of specific modules, see:
- [API Reference](API-REFERENCE.md)
- [Speedrun Guide](SPEEDRUN-GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

**⚡ "Good architecture is the difference between 10 hours and 5 hours" ⚡**
