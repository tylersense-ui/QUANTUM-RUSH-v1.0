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
 * @module      lib/capabilities
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Dynamic Source File and API capability detection
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite with caching and extended detection
 *            - Added all SF detection (SF1-14)
 *            - Added program file detection
 *            - Added caching for performance
 *            - Added detailed SF level tracking
 *            - BN-safe error handling
 *   v1.0.0 - Legacy basic detection (SF4, SF8 only)
 * 
 * @requirements
 *   - None (pure detection, handles missing APIs gracefully)
 * 
 * @example
 * const caps = new Capabilities(ns);
 * 
 * if (caps.singularity) {
 *   ns.singularity.workForFaction("CyberSec");
 * } else {
 *   ns.tprint("Work for CyberSec manually");
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CAPABILITIES CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class Capabilities {
    /**
     * Create a capabilities detector
     * @param {NS} ns - Netscript object
     */
    constructor(ns) {
        this.ns = ns;
        
        // Cache results to avoid repeated expensive checks
        this._cache = {
            lastUpdate: 0,
            cacheDuration: 60000  // 60 seconds
        };
        
        // Initialize detection
        this.update();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔄 UPDATE DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Update all capability detections
     * Call this periodically or when capabilities might have changed
     * 
     * @param {boolean} force - Force update even if cache is valid
     */
    update(force = false) {
        const now = Date.now();
        
        // Use cache if still valid and not forcing
        if (!force && (now - this._cache.lastUpdate) < this._cache.cacheDuration) {
            return;
        }
        
        this._detectPrograms();
        this._detectSourceFiles();
        this._detectAPIs();
        
        this._cache.lastUpdate = now;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔓 CRACK PROGRAMS DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Detect available crack programs
     * @private
     */
    _detectPrograms() {
        const ns = this.ns;
        
        // Crack tools
        this.brutessh = ns.fileExists("BruteSSH.exe", "home");
        this.ftpcrack = ns.fileExists("FTPCrack.exe", "home");
        this.relaysmtp = ns.fileExists("relaySMTP.exe", "home");
        this.httpworm = ns.fileExists("HTTPWorm.exe", "home");
        this.sqlinject = ns.fileExists("SQLInject.exe", "home");
        
        // Special programs
        this.formulas = ns.fileExists("Formulas.exe", "home");
        this.deepscan = ns.fileExists("DeepscanV1.exe", "home") || 
                       ns.fileExists("DeepscanV2.exe", "home");
        this.autolink = ns.fileExists("AutoLink.exe", "home");
        
        // Count available ports
        this.portsAvailable = [
            this.brutessh,
            this.ftpcrack,
            this.relaysmtp,
            this.httpworm,
            this.sqlinject
        ].filter(Boolean).length;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎯 SOURCE FILE DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Detect owned Source Files and their levels
     * @private
     */
    _detectSourceFiles() {
        const ns = this.ns;
        
        // Initialize SF tracking
        this.sourceFiles = {};
        
        try {
            // Try to get owned source files (requires SF4 or in-BitNode access)
            const owned = ns.getOwnedSourceFiles();
            
            for (const sf of owned) {
                this.sourceFiles[`SF${sf.n}`] = sf.lvl;
            }
        } catch (e) {
            // No SF4 or no owned SFs yet - this is fine
        }
        
        // Set convenient boolean flags
        this.hasSF1 = (this.sourceFiles.SF1 || 0) > 0;  // Source Genesis
        this.hasSF2 = (this.sourceFiles.SF2 || 0) > 0;  // Rise of the Underworld
        this.hasSF3 = (this.sourceFiles.SF3 || 0) > 0;  // Corporatocracy
        this.hasSF4 = (this.sourceFiles.SF4 || 0) > 0;  // The Singularity
        this.hasSF5 = (this.sourceFiles.SF5 || 0) > 0;  // Artificial Intelligence
        this.hasSF6 = (this.sourceFiles.SF6 || 0) > 0;  // Bladeburners
        this.hasSF7 = (this.sourceFiles.SF7 || 0) > 0;  // Bladeburners 2079
        this.hasSF8 = (this.sourceFiles.SF8 || 0) > 0;  // Ghost of Wall Street
        this.hasSF9 = (this.sourceFiles.SF9 || 0) > 0;  // Hacktocracy
        this.hasSF10 = (this.sourceFiles.SF10 || 0) > 0; // Digital Carbon
        this.hasSF11 = (this.sourceFiles.SF11 || 0) > 0; // The Big Crash
        this.hasSF12 = (this.sourceFiles.SF12 || 0) > 0; // The Recursion
        this.hasSF13 = (this.sourceFiles.SF13 || 0) > 0; // They're lunatics
        this.hasSF14 = (this.sourceFiles.SF14 || 0) > 0; // IPvGO Subnet Takeover
        
        // Get SF levels (0 if not owned)
        this.sf1Level = this.sourceFiles.SF1 || 0;
        this.sf2Level = this.sourceFiles.SF2 || 0;
        this.sf3Level = this.sourceFiles.SF3 || 0;
        this.sf4Level = this.sourceFiles.SF4 || 0;
        this.sf5Level = this.sourceFiles.SF5 || 0;
        this.sf6Level = this.sourceFiles.SF6 || 0;
        this.sf7Level = this.sourceFiles.SF7 || 0;
        this.sf8Level = this.sourceFiles.SF8 || 0;
        this.sf9Level = this.sourceFiles.SF9 || 0;
        this.sf10Level = this.sourceFiles.SF10 || 0;
        this.sf11Level = this.sourceFiles.SF11 || 0;
        this.sf12Level = this.sourceFiles.SF12 || 0;
        this.sf13Level = this.sourceFiles.SF13 || 0;
        this.sf14Level = this.sourceFiles.SF14 || 0;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔌 API DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Detect available APIs
     * @private
     */
    _detectAPIs() {
        const ns = this.ns;
        
        // ─────────────────────────────────────────────────────────────────
        // SINGULARITY API (SF4)
        // ─────────────────────────────────────────────────────────────────
        this.singularity = false;
        try {
            // Try a safe read-only call
            ns.singularity.getOwnedAugmentations();
            this.singularity = true;
        } catch (e) {
            // API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // STOCK MARKET API (SF8 + TIX purchase)
        // ─────────────────────────────────────────────────────────────────
        this.tix = false;
        this.has4S = false;
        
        try {
            if (ns.stock) {
                this.tix = ns.stock.hasTIXAPIAccess();
                
                // 4S Data (requires TIX + additional purchase)
                if (this.tix) {
                    try {
                        this.has4S = ns.stock.has4SDataAPIAccess();
                    } catch (e) {
                        this.has4S = false;
                    }
                }
            }
        } catch (e) {
            // Stock API not available in this BitNode
        }
        
        // ─────────────────────────────────────────────────────────────────
        // GANG API (SF2 or BN2)
        // ─────────────────────────────────────────────────────────────────
        this.gang = false;
        this.inGang = false;
        
        try {
            if (ns.gang) {
                this.gang = true;
                this.inGang = ns.gang.inGang();
            }
        } catch (e) {
            // Gang API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // CORPORATION API (SF3 or BN3)
        // ─────────────────────────────────────────────────────────────────
        this.corporation = false;
        this.hasCorporation = false;
        
        try {
            if (ns.corporation) {
                this.corporation = true;
                this.hasCorporation = ns.corporation.hasCorporation();
            }
        } catch (e) {
            // Corporation API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // BLADEBURNER API (SF6/SF7 or BN6/BN7)
        // ─────────────────────────────────────────────────────────────────
        this.bladeburner = false;
        this.inBladeburner = false;
        
        try {
            if (ns.bladeburner) {
                this.bladeburner = true;
                
                try {
                    // This will throw if not in Bladeburner
                    ns.bladeburner.getRank();
                    this.inBladeburner = true;
                } catch (e) {
                    this.inBladeburner = false;
                }
            }
        } catch (e) {
            // Bladeburner API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // SLEEVE API (SF10)
        // ─────────────────────────────────────────────────────────────────
        this.sleeves = false;
        this.numSleeves = 0;
        
        try {
            if (ns.sleeve) {
                this.numSleeves = ns.sleeve.getNumSleeves();
                this.sleeves = this.numSleeves > 0;
            }
        } catch (e) {
            // Sleeve API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // STANEK API (SF13 or BN13)
        // ─────────────────────────────────────────────────────────────────
        this.stanek = false;
        this.hasStanek = false;
        
        try {
            if (ns.stanek) {
                this.stanek = true;
                
                try {
                    // Check if gift is active
                    ns.stanek.giftWidth();
                    this.hasStanek = true;
                } catch (e) {
                    this.hasStanek = false;
                }
            }
        } catch (e) {
            // Stanek API not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // GRAFTING API (SF10 level 3+)
        // ─────────────────────────────────────────────────────────────────
        this.grafting = false;
        
        try {
            if (ns.grafting && this.sf10Level >= 3) {
                this.grafting = true;
            }
        } catch (e) {
            // Grafting not available
        }
        
        // ─────────────────────────────────────────────────────────────────
        // HACKNET SERVER API (SF9)
        // ─────────────────────────────────────────────────────────────────
        this.hacknetServer = false;
        
        try {
            if (ns.hacknet && ns.hacknet.hashCost) {
                // Check if hacknet servers are available (vs nodes)
                this.hacknetServer = true;
            }
        } catch (e) {
            this.hacknetServer = false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📊 CONVENIENCE METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get a summary of all capabilities
     * @returns {Object} Capability summary
     */
    getSummary() {
        return {
            // Programs
            programs: {
                brutessh: this.brutessh,
                ftpcrack: this.ftpcrack,
                relaysmtp: this.relaysmtp,
                httpworm: this.httpworm,
                sqlinject: this.sqlinject,
                formulas: this.formulas,
                portsAvailable: this.portsAvailable
            },
            
            // Source Files
            sourceFiles: this.sourceFiles,
            
            // APIs
            apis: {
                singularity: this.singularity,
                tix: this.tix,
                has4S: this.has4S,
                gang: this.gang,
                inGang: this.inGang,
                corporation: this.corporation,
                hasCorporation: this.hasCorporation,
                bladeburner: this.bladeburner,
                inBladeburner: this.inBladeburner,
                sleeves: this.sleeves,
                numSleeves: this.numSleeves,
                stanek: this.stanek,
                hasStanek: this.hasStanek,
                grafting: this.grafting,
                hacknetServer: this.hacknetServer
            }
        };
    }

    /**
     * Check if can crack a server with given port requirement
     * @param {number} portsRequired - Number of ports needed
     * @returns {boolean} True if can crack
     */
    canCrack(portsRequired) {
        return this.portsAvailable >= portsRequired;
    }

    /**
     * Get list of available crack functions
     * @returns {Function[]} Array of crack functions
     */
    getCrackFunctions() {
        const ns = this.ns;
        const cracks = [];
        
        if (this.brutessh) cracks.push(() => ns.brutessh);
        if (this.ftpcrack) cracks.push(() => ns.ftpcrack);
        if (this.relaysmtp) cracks.push(() => ns.relaysmtp);
        if (this.httpworm) cracks.push(() => ns.httpworm);
        if (this.sqlinject) cracks.push(() => ns.sqlinject);
        
        return cracks;
    }

    /**
     * Check if any Source Files are owned
     * @returns {boolean} True if at least one SF owned
     */
    hasAnySF() {
        return Object.keys(this.sourceFiles).length > 0;
    }

    /**
     * Get total SF count
     * @returns {number} Number of unique SFs owned
     */
    getSFCount() {
        return Object.keys(this.sourceFiles).length;
    }

    /**
     * Get total SF levels (sum of all levels)
     * @returns {number} Sum of all SF levels
     */
    getTotalSFLevels() {
        return Object.values(this.sourceFiles).reduce((sum, lvl) => sum + lvl, 0);
    }

    /**
     * Check if a specific SF is owned at minimum level
     * @param {number} sfNumber - SF number (1-14)
     * @param {number} minLevel - Minimum level required (default: 1)
     * @returns {boolean} True if SF owned at minimum level
     */
    hasSF(sfNumber, minLevel = 1) {
        const level = this.sourceFiles[`SF${sfNumber}`] || 0;
        return level >= minLevel;
    }

    /**
     * Get BitNode multipliers (if SF5 available)
     * @returns {Object|null} Multipliers or null if not available
     */
    getBitNodeMultipliers() {
        if (!this.hasSF5) return null;
        
        try {
            return this.ns.getBitNodeMultipliers();
        } catch (e) {
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 DISPLAY HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Print capability summary to terminal
     */
    printSummary() {
        const ns = this.ns;
        
        ns.tprint("════════════════════════════════════════");
        ns.tprint("🎯 CAPABILITY DETECTION SUMMARY");
        ns.tprint("════════════════════════════════════════");
        
        // Programs
        ns.tprint("\n📦 PROGRAMS:");
        ns.tprint(`  BruteSSH.exe   : ${this.brutessh ? "✅" : "❌"}`);
        ns.tprint(`  FTPCrack.exe   : ${this.ftpcrack ? "✅" : "❌"}`);
        ns.tprint(`  relaySMTP.exe  : ${this.relaysmtp ? "✅" : "❌"}`);
        ns.tprint(`  HTTPWorm.exe   : ${this.httpworm ? "✅" : "❌"}`);
        ns.tprint(`  SQLInject.exe  : ${this.sqlinject ? "✅" : "❌"}`);
        ns.tprint(`  Formulas.exe   : ${this.formulas ? "✅" : "❌"}`);
        ns.tprint(`  → Ports Available: ${this.portsAvailable}/5`);
        
        // Source Files
        ns.tprint("\n🎯 SOURCE FILES:");
        if (this.hasAnySF()) {
            for (const [sf, level] of Object.entries(this.sourceFiles)) {
                ns.tprint(`  ${sf} Level ${level} ✅`);
            }
            ns.tprint(`  → Total: ${this.getSFCount()} SFs (${this.getTotalSFLevels()} levels)`);
        } else {
            ns.tprint("  No Source Files owned yet");
        }
        
        // APIs
        ns.tprint("\n🔌 APIS:");
        ns.tprint(`  Singularity    : ${this.singularity ? "✅" : "❌"} (SF4)`);
        ns.tprint(`  Stock TIX      : ${this.tix ? "✅" : "❌"}`);
        ns.tprint(`  Stock 4S Data  : ${this.has4S ? "✅" : "❌"}`);
        ns.tprint(`  Gang           : ${this.gang ? "✅" : "❌"} (In gang: ${this.inGang ? "Yes" : "No"})`);
        ns.tprint(`  Corporation    : ${this.corporation ? "✅" : "❌"} (Has corp: ${this.hasCorporation ? "Yes" : "No"})`);
        ns.tprint(`  Bladeburner    : ${this.bladeburner ? "✅" : "❌"} (In BB: ${this.inBladeburner ? "Yes" : "No"})`);
        ns.tprint(`  Sleeves        : ${this.sleeves ? "✅" : "❌"} (Count: ${this.numSleeves})`);
        ns.tprint(`  Stanek         : ${this.stanek ? "✅" : "❌"} (Active: ${this.hasStanek ? "Yes" : "No"})`);
        ns.tprint(`  Grafting       : ${this.grafting ? "✅" : "❌"}`);
        
        ns.tprint("\n════════════════════════════════════════");
    }

    /**
     * Get color-coded capability string
     * @param {string} capability - Capability name
     * @returns {string} Color-coded string
     */
    getStatusString(capability) {
        const hasIt = this[capability] === true;
        return hasIt ? "✅ Available" : "❌ Locked";
    }

    /**
     * Get missing critical capabilities
     * @returns {string[]} List of missing critical features
     */
    getMissingCritical() {
        const missing = [];
        
        if (!this.brutessh) missing.push("BruteSSH.exe");
        if (!this.singularity) missing.push("SF4 (Singularity)");
        if (!this.tix) missing.push("TIX API Access");
        if (!this.formulas) missing.push("Formulas.exe");
        
        return missing;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 STANDALONE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quick capability check without creating full object
 * @param {NS} ns - Netscript object
 * @param {string} capability - Capability to check
 * @returns {boolean} True if available
 * 
 * @example
 * if (quickCheck(ns, "singularity")) {
 *   ns.singularity.workForFaction("CyberSec");
 * }
 */
export function quickCheck(ns, capability) {
    const caps = new Capabilities(ns);
    return caps[capability] === true;
}

/**
 * Get Source File level
 * @param {NS} ns - Netscript object
 * @param {number} sfNumber - SF number (1-14)
 * @returns {number} SF level (0 if not owned)
 * 
 * @example
 * const sf4Level = getSFLevel(ns, 4);
 * if (sf4Level >= 3) {
 *   // Full singularity access
 * }
 */
export function getSFLevel(ns, sfNumber) {
    const caps = new Capabilities(ns);
    return caps.sourceFiles[`SF${sfNumber}`] || 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default Capabilities;

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "Know your tools before you build" ⚡
// ═══════════════════════════════════════════════════════════════════════════
