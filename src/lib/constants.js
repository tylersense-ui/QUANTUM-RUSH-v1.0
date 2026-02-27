/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║                                                          ║
 * ║   ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗║
 * ║  ██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║║
 * ║  ██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║║
 * ║  ██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║║
 * ║  ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝║
 * ║   ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ║
 * ║                 ██████╗ ██╗   ██╗███████╗██╗  ██╗       ║
 * ║                 ██╔══██╗██║   ██║██╔════╝██║  ██║       ║
 * ║                 ██████╔╝██║   ██║███████╗███████║       ║
 * ║                 ██╔══██╗██║   ██║╚════██║██╔══██║       ║
 * ║                 ██║  ██║╚██████╔╝███████║██║  ██║       ║
 * ║                 ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       ║
 * ║                                                          ║
 * ║              APEX v2.0 SPEEDRUN EDITION                  ║
 * ║                                                          ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * @module      lib/constants
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Central configuration hub for Quantum-Rush framework
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite for speedrun optimization
 *            - Added MILESTONES system
 *            - Added SPEEDRUN config section
 *            - Optimized HACKING values for aggression
 *            - Added PHASES detection thresholds
 *   v1.0.0 - Legacy Nexus-Apex configuration
 * 
 * @requirements
 *   - None (pure configuration)
 *   - Imported by all modules
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 VERSION & METADATA
// ═══════════════════════════════════════════════════════════════════════════

export const VERSION = {
    MAJOR: 2,
    MINOR: 0,
    PATCH: 0,
    BUILD: "speedrun",
    FULL: "2.0.0-speedrun",
    CODENAME: "QUANTUM-LEAP",
    RELEASE_DATE: "2025-02-27"
};

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 SPEEDRUN CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const SPEEDRUN = {
    /**
     * 🎯 TARGET BENCHMARKS (in-game milliseconds)
     * These are aggressive targets for optimal runs
     */
    MILESTONES: {
        // Early Phase (0 → $100k)
        FIRST_10K:      3 * 60 * 1000,      // 3min  - First $10k from crime/hack
        FIRST_100K:     5 * 60 * 1000,      // 5min  - $100k = First pserver
        BRUTESSH:       8 * 60 * 1000,      // 8min  - Buy BruteSSH.exe
        
        // Mid Phase ($100k → $1B)
        CYBERSEC:       15 * 60 * 1000,     // 15min - Join CyberSec
        FIRST_1M:       20 * 60 * 1000,     // 20min - First $1 million
        NITESEC:        45 * 60 * 1000,     // 45min - Join NiteSec
        FIRST_100M:     60 * 60 * 1000,     // 1h    - $100 million
        BLACK_HAND:     90 * 60 * 1000,     // 1h30  - Join The Black Hand
        FIRST_1B:       2 * 60 * 60 * 1000, // 2h    - First $1 billion
        
        // Late Phase ($1B → Red Pill)
        TIX_API:        2.5 * 60 * 60 * 1000,   // 2h30  - Buy TIX API ($5b)
        FOUR_SIGMA_API: 3 * 60 * 60 * 1000,     // 3h    - Buy 4S Data ($25b)
        BITRUNNERS:     4 * 60 * 60 * 1000,     // 4h    - Join BitRunners
        FIRST_100B:     4.5 * 60 * 60 * 1000,   // 4h30  - $100 billion
        DAEDALUS_REP:   5 * 60 * 60 * 1000,     // 5h    - 2.5m rep for Daedalus
        DAEDALUS_JOIN:  5.5 * 60 * 60 * 1000,   // 5h30  - Join Daedalus
        RED_PILL:       6 * 60 * 60 * 1000      // 6h    - Install Red Pill (TARGET)
    },

    /**
     * 📊 PHASE DETECTION THRESHOLDS
     * Auto-detection of game phase for strategy switching
     */
    PHASES: {
        EARLY: {
            MAX_MONEY: 100000,              // $100k
            MAX_HACK_LEVEL: 50,             // Level 50
            MAX_SERVERS_OWNED: 5,           // 5 pservers
            STRATEGY: "crime-hack-hybrid"
        },
        MID: {
            MAX_MONEY: 1000000000,          // $1B
            MAX_HACK_LEVEL: 200,            // Level 200
            MAX_SERVERS_OWNED: 15,          // 15 pservers
            STRATEGY: "batch-hwgw-stock"
        },
        LATE: {
            MIN_MONEY: 1000000000,          // $1B+
            MIN_HACK_LEVEL: 200,            // Level 200+
            MIN_SERVERS_OWNED: 15,          // 15+ pservers
            STRATEGY: "full-automation"
        }
    },

    /**
     * 🎯 FACTION ROUTE (Optimal 30 aug path to Daedalus)
     * Order matters for rep/aug efficiency
     */
    FACTION_ROUTE: [
        { 
            name: "CyberSec", 
            priority: 1,
            target_augs: 1,             // BitWire
            required_rep: 50000,        // 50k rep
            join_requirements: "Hack 50 + Backdoor CSEC"
        },
        { 
            name: "Tian Di Hui", 
            priority: 2,
            target_augs: 5,             // Early cheap augs
            required_rep: 37500,        // 37.5k rep (Nanofiber Weave)
            join_requirements: "Hack 50 + City: Chongqing/New Tokyo/Ishima"
        },
        { 
            name: "NiteSec", 
            priority: 3,
            target_augs: 4,             // Mid-tier hacking
            required_rep: 75000,        // 75k rep (Neuroreceptor)
            join_requirements: "Hack 100 + Backdoor avmnite-02h"
        },
        { 
            name: "The Black Hand", 
            priority: 4,
            target_augs: 6,             // Advanced hacking
            required_rep: 200000,       // 200k rep (Neural Accelerator)
            join_requirements: "Hack 175 + Backdoor I.I.I.I"
        },
        { 
            name: "BitRunners", 
            priority: 5,
            target_augs: 12,            // Elite hacking + expensive
            required_rep: 875000,       // 875k rep (BitRunners Neurolink)
            join_requirements: "Hack 500 + Backdoor run4theh111z"
        },
        { 
            name: "Daedalus", 
            priority: 6,
            target_augs: 2,             // Red Pill + The Red Pill
            required_rep: 2500000,      // 2.5m rep (The Red Pill)
            join_requirements: "30 installed augs OR Hack 2500 + $100b"
        }
    ],

    /**
     * ⚠️ WARNING THRESHOLDS
     * Alert if falling behind pace
     */
    ALERTS: {
        BEHIND_PERCENTAGE: 20,      // Alert if 20%+ behind target
        CRITICAL_PERCENTAGE: 40,    // Critical alert if 40%+ behind
        CHECK_INTERVAL: 60000       // Check every 1 minute
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔌 PORT CONFIGURATION (NetScript IPC)
// ═══════════════════════════════════════════════════════════════════════════

export const PORTS = {
    NETWORK_MAP:    1,      // Network topology cache
    TARGET_QUEUE:   2,      // HWGW target queue
    LOG_STREAM:     3,      // Centralized logging
    COMMANDS:       4,      // Worker dispatch commands
    STOCK_DATA:     5,      // Stock market status
    SHARE_RATIO:    6,      // Reputation boost ratio
    MILESTONE:      7,      // Speedrun milestone tracking
    PHASE_STATE:    8       // Current phase detection
};

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ HACKING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const HACKING = {
    /**
     * 🎯 BATCH HWGW SETTINGS (Ultra-Aggressive)
     */
    BATCH_SPACING: 10,              // 10ms spacing (speedrun mode, was 30ms)
    BATCH_DELAY_BUFFER: 5,          // 5ms safety buffer
    HACK_PERCENTAGE: 0.15,          // Take 15% per batch (aggressive, was 10%)
    
    /**
     * 🎯 PREPARATION PHASE
     */
    MIN_SECURITY_THRESHOLD: 0.5,    // Start batching when sec ≤ min + 0.5
    MAX_MONEY_PERCENTAGE: 0.98,     // Start batching when money ≥ 98% max
    PREP_WEAKEN_THREADS: 500,       // Weaken spam threads (was 100)
    PREP_GROW_THREADS: 200,         // Grow spam threads (was 50)
    
    /**
     * 🎯 TARGET SELECTION
     */
    MAX_TARGET_DIFFICULTY: 50,      // Skip servers harder than this
    MIN_TARGET_MONEY: 1000000,      // Skip servers with < $1m max
    TOP_TARGETS_COUNT: 5,           // Track top 5 profitable servers
    TARGET_SWITCH_INTERVAL: 30000,  // Re-evaluate targets every 30s
    
    /**
     * 🎯 RAM MANAGEMENT
     */
    RESERVED_HOME_RAM: 64,          // Reserve 64GB on home (was 128GB)
    MIN_THREAD_RAM: 1.75,           // Minimum RAM per thread
    EMERGENCY_RAM_RESERVE: 32,      // Emergency reserve if RAM critical
    
    /**
     * 🎯 WORKER SCRIPTS
     */
    WORKERS: {
        HACK:   "/src/hack/workers/hack.js",
        GROW:   "/src/hack/workers/grow.js",
        WEAKEN: "/src/hack/workers/weaken.js",
        SHARE:  "/src/hack/workers/share.js"
    },
    
    /**
     * 🎯 PERFORMANCE TUNING
     */
    USE_FORMULAS: true,             // Use Formulas.exe if available
    CACHE_SERVER_DATA: true,        // Cache ns.getServer() calls
    CACHE_DURATION: 5000,           // 5 second cache
    IN_FLIGHT_TRACKING: true        // Track running batches
};

// ═══════════════════════════════════════════════════════════════════════════
// 💰 STOCK MARKET CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const STOCK = {
    /**
     * 🎯 TRADING THRESHOLDS (Aggressive)
     */
    BUY_THRESHOLD: 0.55,            // Buy if forecast ≥ 0.55 (was 0.60)
    SELL_THRESHOLD: 0.50,           // Sell if forecast < 0.50 (was 0.50)
    MIN_TRANSACTION: 5000000,       // $5m minimum trade
    RESERVE_CASH: 50000000,         // Keep $50m liquid (was 100m)
    
    /**
     * 🎯 PORTFOLIO MANAGEMENT
     */
    MAX_POSITIONS: 20,              // Max simultaneous positions
    POSITION_SIZE_PERCENTAGE: 0.15, // 15% of portfolio per position
    AUTO_LIQUIDATE_FOR_AUGS: true,  // Sell stocks when buying augs
    LIQUIDATE_THRESHOLD: 0.9,       // Liquidate if 90% of aug cost needed
    
    /**
     * 🎯 4S DATA API
     */
    REQUIRES_4S: true,              // Only trade aggressively with 4S
    MONITOR_WITHOUT_4S: true,       // Track prices even without 4S
    UPDATE_INTERVAL: 6000           // Check every market tick (~6s)
};

// ═══════════════════════════════════════════════════════════════════════════
// 🖥️ SERVER MANAGEMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const SERVERS = {
    /**
     * 🎯 PURCHASED SERVERS (Aggressive Early Buying)
     */
    PREFIX: "qr-node-",             // Quantum-Rush node prefix
    MAX_SERVERS: 25,                // Max purchasable servers
    
    /**
     * 🎯 EARLY GAME STRATEGY (0 → $1B)
     */
    EARLY: {
        FIRST_BUY_CASH: 100000,     // Buy first 8GB server at $100k
        FIRST_RAM: 8,               // Start with 8GB
        UPGRADE_TO: 64,             // Upgrade to 64GB each
        MAX_COUNT: 5,               // Max 5 servers in early
        BUDGET_PERCENTAGE: 0.5      // Spend 50% of cash on servers
    },
    
    /**
     * 🎯 MID GAME STRATEGY ($1B → $100B)
     */
    MID: {
        TARGET_RAM: 256,            // 256GB each
        MAX_COUNT: 15,              // Max 15 servers in mid
        BUDGET_PERCENTAGE: 0.3      // Spend 30% of cash on servers
    },
    
    /**
     * 🎯 LATE GAME STRATEGY ($100B+)
     */
    LATE: {
        TARGET_RAM: 1048576,        // 1PB (max)
        MAX_COUNT: 25,              // All 25 servers
        BUDGET_PERCENTAGE: 0.1      // Spend 10% of cash (focus on augs)
    },
    
    /**
     * 🎯 UPGRADE LOGIC
     */
    UPGRADE_MULTIPLIER: 2,          // Double RAM each upgrade
    MIN_UPGRADE_GAP: 30000          // Wait 30s between upgrades
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎮 MANAGER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const MANAGERS = {
    /**
     * 🎯 SINGULARITY (Requires SF4)
     */
    SINGULARITY: {
        AUTO_JOIN_FACTIONS: true,       // Auto-accept invites
        AUTO_WORK_FACTIONS: true,       // Auto-work for rep
        AUTO_BUY_AUGS: true,            // Auto-purchase augs
        AUTO_CRIME: true,               // Crime if idle
        CRIME_TARGET: "Homicide",       // Best $/time mid-game
        WORK_TYPE: "Hacking Contracts", // Faction work type
        TRAVEL_FOR_FACTIONS: true,      // Auto-travel to cities
        BUY_TOR: true,                  // Auto-buy TOR router
        BUY_PROGRAMS: true              // Auto-buy crack programs
    },
    
    /**
     * 🎯 HACKNET (Passive Income)
     */
    HACKNET: {
        ENABLED: true,
        MAX_NODES: 25,
        BUDGET_PERCENTAGE: 0.05,        // 5% of cash max
        UPGRADE_PRIORITY: "balanced"    // balanced/level/ram/cores
    },
    
    /**
     * 🎯 GANG (Requires SF2)
     */
    GANG: {
        ENABLED: true,
        TERRITORY_WARFARE: true,
        MIN_WIN_CHANCE: 0.85,           // 85% win chance for wars
        FOCUS: "money"                  // money/respect/territory
    },
    
    /**
     * 🎯 CORPORATION (Requires SF3)
     */
    CORPORATION: {
        ENABLED: false,                 // Disabled for BN1 speedrun
        AUTO_MANAGEMENT: true
    },
    
    /**
     * 🎯 SLEEVES (Requires SF10)
     */
    SLEEVES: {
        ENABLED: true,
        SHOCK_PRIORITY: true,           // Recover shock first
        SYNC_PRIORITY: true,            // Then synchronize
        TASK: "crime"                   // crime/faction/company
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 UI & DISPLAY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const UI = {
    /**
     * 🎨 COLOR PALETTE (ANSI Escape Codes)
     */
    COLORS: {
        // Status Colors
        SUCCESS:    "\u001b[38;5;46m",      // Bright green
        ERROR:      "\u001b[38;5;196m",     // Bright red
        WARNING:    "\u001b[38;5;214m",     // Orange
        INFO:       "\u001b[38;5;51m",      // Cyan
        DEBUG:      "\u001b[38;5;245m",     // Gray
        
        // Speedrun Colors
        AHEAD:      "\u001b[38;5;82m",      // Green (ahead of pace)
        ON_PACE:    "\u001b[38;5;226m",     // Yellow (on pace)
        BEHIND:     "\u001b[38;5;202m",     // Orange (behind pace)
        CRITICAL:   "\u001b[38;5;196m",     // Red (critically behind)
        
        // Accent Colors
        MONEY:      "\u001b[38;5;11m",      // Gold
        HACK:       "\u001b[38;5;99m",      // Purple
        FACTION:    "\u001b[38;5;27m",      // Blue
        AUG:        "\u001b[38;5;201m",     // Magenta
        
        // Reset
        RESET:      "\u001b[0m"
    },
    
    /**
     * 📊 DASHBOARD SETTINGS
     */
    DASHBOARD: {
        REFRESH_RATE: 1000,             // Update every 1 second
        WIDTH: 70,                      // Terminal width
        SHOW_SPARKLINES: true,          // Show profit trends
        SHOW_PROGRESS_BARS: true,       // Show progress bars
        SHOW_NETWORK_STATUS: true,      // Show RAM/servers
        SHOW_MILESTONES: true,          // Show speedrun milestones
        MAX_LOG_LINES: 10               // Max recent log entries
    },
    
    /**
     * 🎯 ICONS (Emoji)
     */
    ICONS: {
        // Status
        SUCCESS:    "✅",
        ERROR:      "❌",
        WARNING:    "⚠️",
        INFO:       "ℹ️",
        LOADING:    "⏳",
        LOCKED:     "🔒",
        
        // Resources
        MONEY:      "💰",
        HACK:       "💻",
        RAM:        "💾",
        SERVER:     "🖥️",
        
        // Progress
        TARGET:     "🎯",
        MILESTONE:  "🏁",
        AHEAD:      "🚀",
        BEHIND:     "🐌",
        
        // Factions
        FACTION:    "👥",
        AUG:        "💉",
        REP:        "⭐",
        
        // Actions
        ATTACK:     "⚔️",
        DEFEND:     "🛡️",
        GROW:       "📈",
        WEAKEN:     "🔓"
    },
    
    /**
     * 📊 PROGRESS BAR CHARACTERS
     */
    PROGRESS: {
        FILL:       "█",
        EMPTY:      "░",
        PARTIAL:    ["▏","▎","▍","▌","▋","▊","▉"],
        WIDTH:      40                  // Bar width in chars
    },
    
    /**
     * 📈 SPARKLINE CHARACTERS
     */
    SPARKLINE: {
        CHARS:      ["▁","▂","▃","▄","▅","▆","▇","█"],
        WIDTH:      20                  // Sparkline width
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 SYSTEM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const SYSTEM = {
    /**
     * 🎯 LOGGING
     */
    DEBUG_MODE: false,                  // Verbose logging
    LOG_TO_FILE: false,                 // Write logs to file
    LOG_LEVEL: "INFO",                  // DEBUG/INFO/WARN/ERROR
    
    /**
     * 🎯 PERFORMANCE
     */
    TICK_RATE: 100,                     // Main loop tick (ms)
    BATCH_PROCESS_LIMIT: 100,           // Max batches processed per tick
    CACHE_ENABLED: true,                // Enable result caching
    
    /**
     * 🎯 SAFETY
     */
    EMERGENCY_STOP_ENABLED: true,       // Enable emergency stop
    AUTO_RESTART_ON_CRASH: false,       // Don't auto-restart (debug)
    MAX_RETRIES: 3,                     // Max retry attempts
    
    /**
     * 🎯 TIMING
     */
    STARTUP_DELAY: 1000,                // Wait 1s after boot
    SHUTDOWN_GRACE: 5000,               // 5s grace period for cleanup
    HEARTBEAT_INTERVAL: 30000           // 30s heartbeat check
};

// ═══════════════════════════════════════════════════════════════════════════
// 📦 EXPORT CONSOLIDATED CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export const CONFIG = {
    VERSION,
    SPEEDRUN,
    PORTS,
    HACKING,
    STOCK,
    SERVERS,
    MANAGERS,
    UI,
    SYSTEM
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the current phase based on player state
 * @param {number} money - Current money
 * @param {number} hackLevel - Current hacking level
 * @param {number} serversOwned - Number of purchased servers
 * @returns {string} "early" | "mid" | "late"
 */
export function detectPhase(money, hackLevel, serversOwned) {
    if (money < SPEEDRUN.PHASES.EARLY.MAX_MONEY || 
        hackLevel < SPEEDRUN.PHASES.EARLY.MAX_HACK_LEVEL) {
        return "early";
    }
    if (money < SPEEDRUN.PHASES.MID.MAX_MONEY || 
        hackLevel < SPEEDRUN.PHASES.MID.MAX_HACK_LEVEL) {
        return "mid";
    }
    return "late";
}

/**
 * Get milestone target time
 * @param {string} milestone - Milestone name
 * @returns {number} Target time in milliseconds
 */
export function getMilestoneTarget(milestone) {
    return SPEEDRUN.MILESTONES[milestone] || 0;
}

/**
 * Check if behind schedule
 * @param {number} currentTime - Current in-game time
 * @param {string} milestone - Milestone to check
 * @returns {Object} { behind: boolean, percentage: number }
 */
export function checkPace(currentTime, milestone) {
    const target = getMilestoneTarget(milestone);
    if (target === 0) return { behind: false, percentage: 0 };
    
    const diff = currentTime - target;
    const percentage = (diff / target) * 100;
    
    return {
        behind: diff > 0,
        percentage: Math.abs(percentage),
        critical: percentage > SPEEDRUN.ALERTS.CRITICAL_PERCENTAGE
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "Configuration is the foundation of speed" ⚡
// ═══════════════════════════════════════════════════════════════════════════
