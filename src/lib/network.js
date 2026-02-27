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
 * @module      lib/network
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Network scanner with intelligent scoring and caching
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite with advanced features
 *            - Added aggressive caching system
 *            - Added Formulas.exe integration
 *            - Added server scoring algorithms
 *            - Added topology caching
 *            - Optimized for speedrun (target selection)
 *   v1.0.0 - Legacy basic scanner
 * 
 * @requirements
 *   - lib/capabilities.js (for crack detection)
 *   - lib/constants.js (for thresholds)
 * 
 * @example
 * const net = new Network(ns, caps);
 * const servers = net.refresh();
 * const best = net.getBestTarget();
 * net.crack(best);
 */

import { HACKING } from "./constants.js";

// ═══════════════════════════════════════════════════════════════════════════
// 🌐 NETWORK CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class Network {
    /**
     * Create a network manager
     * @param {NS} ns - Netscript object
     * @param {Capabilities} caps - Capabilities detector
     */
    constructor(ns, caps) {
        this.ns = ns;
        this.caps = caps;
        
        // Cache system
        this._cache = {
            topology: null,           // Network topology (server list)
            topologyAge: 0,           // Last topology scan
            scores: {},               // Server scores cache
            scoresAge: {},            // Age of each score
            serverData: {},           // Cached ns.getServer() results
            serverDataAge: {},        // Age of cached data
            
            // Cache durations (ms)
            topologyTTL: 60000,       // 60s - network rarely changes
            scoreTTL: 30000,          // 30s - scores change with player level
            serverDataTTL: 5000       // 5s - server state changes quickly
        };
        
        // Statistics
        this.stats = {
            totalScans: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔄 NETWORK SCANNING
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Scan entire network and return all servers
     * Uses cache if available and fresh
     * 
     * @param {boolean} force - Force rescan even if cache is valid
     * @returns {string[]} Array of server hostnames
     */
    refresh(force = false) {
        const now = Date.now();
        
        // Check cache
        if (!force && 
            this._cache.topology && 
            (now - this._cache.topologyAge) < this._cache.topologyTTL) {
            this.stats.cacheHits++;
            return this._cache.topology;
        }
        
        // Perform scan
        this.stats.cacheMisses++;
        this.stats.totalScans++;
        
        const servers = this._scanNetwork();
        
        // Update cache
        this._cache.topology = servers;
        this._cache.topologyAge = now;
        
        return servers;
    }

    /**
     * Internal network scan implementation (BFS)
     * @private
     * @returns {string[]} List of all servers
     */
    _scanNetwork() {
        const visited = new Set();
        const queue = ["home"];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (visited.has(current)) continue;
            visited.add(current);
            
            // Get neighbors
            const neighbors = this.ns.scan(current);
            
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
        
        return Array.from(visited);
    }

    /**
     * Get cached server data (ns.getServer wrapper)
     * @param {string} hostname - Server hostname
     * @param {boolean} force - Force refresh
     * @returns {Server} Server object
     */
    getServerData(hostname, force = false) {
        const now = Date.now();
        
        // Check cache
        if (!force &&
            this._cache.serverData[hostname] &&
            (now - this._cache.serverDataAge[hostname]) < this._cache.serverDataTTL) {
            return this._cache.serverData[hostname];
        }
        
        // Fetch fresh data
        const data = this.ns.getServer(hostname);
        
        // Update cache
        this._cache.serverData[hostname] = data;
        this._cache.serverDataAge[hostname] = now;
        
        return data;
    }

    /**
     * Clear all caches (useful after major changes)
     */
    clearCache() {
        this._cache.topology = null;
        this._cache.topologyAge = 0;
        this._cache.scores = {};
        this._cache.scoresAge = {};
        this._cache.serverData = {};
        this._cache.serverDataAge = {};
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎯 SERVER SCORING
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Calculate profitability score for a server
     * Higher score = better target for hacking
     * 
     * @param {string} hostname - Server to score
     * @returns {number} Profitability score (0 if invalid target)
     */
    calculateScore(hostname) {
        const now = Date.now();
        
        // Check cache
        if (this._cache.scores[hostname] &&
            (now - this._cache.scoresAge[hostname]) < this._cache.scoreTTL) {
            return this._cache.scores[hostname];
        }
        
        // Calculate score
        const score = this._computeScore(hostname);
        
        // Update cache
        this._cache.scores[hostname] = score;
        this._cache.scoresAge[hostname] = now;
        
        return score;
    }

    /**
     * Internal score calculation
     * @private
     * @param {string} hostname - Server hostname
     * @returns {number} Score
     */
    _computeScore(hostname) {
        const server = this.getServerData(hostname);
        const player = this.ns.getPlayer();
        
        // Filter invalid targets
        if (hostname === "home") return 0;
        if (server.purchasedByPlayer) return 0;
        if (server.moneyMax === 0) return 0;
        if (server.requiredHackingSkill > player.skills.hacking) return 0;
        if (server.minDifficulty > HACKING.MAX_TARGET_DIFFICULTY) return 0;
        
        // Use Formulas.exe if available (more accurate)
        if (this.caps.formulas && HACKING.USE_FORMULAS) {
            try {
                const weakenTime = this.ns.formulas.hacking.weakenTime(server, player);
                
                // Score = money per second
                // Higher money and faster weaken = better score
                return server.moneyMax / (weakenTime / 1000);
            } catch (e) {
                // Fall back to native calculation
            }
        }
        
        // Native calculation (BN1 safe)
        // Score = money / difficulty
        // Simple but effective heuristic
        return server.moneyMax / server.minDifficulty;
    }

    /**
     * Get top N servers by profitability
     * 
     * @param {number} count - Number of servers to return
     * @returns {string[]} Array of server hostnames (best first)
     */
    getTopTargets(count = 5) {
        const servers = this.refresh();
        const scored = [];
        
        for (const hostname of servers) {
            const score = this.calculateScore(hostname);
            if (score > 0) {
                scored.push({ hostname, score });
            }
        }
        
        // Sort by score (descending)
        scored.sort((a, b) => b.score - a.score);
        
        // Return top N hostnames
        return scored.slice(0, count).map(s => s.hostname);
    }

    /**
     * Get best single target
     * @returns {string} Best server hostname
     */
    getBestTarget() {
        const top = this.getTopTargets(1);
        return top.length > 0 ? top[0] : "n00dles";
    }

    /**
     * Get detailed scoring report for all servers
     * @returns {Array} Array of {hostname, score, money, difficulty, hackLevel}
     */
    getScoringReport() {
        const servers = this.refresh();
        const report = [];
        
        for (const hostname of servers) {
            const score = this.calculateScore(hostname);
            if (score > 0) {
                const server = this.getServerData(hostname);
                report.push({
                    hostname: hostname,
                    score: score,
                    money: server.moneyMax,
                    difficulty: server.minDifficulty,
                    hackLevel: server.requiredHackingSkill,
                    hasRoot: this.ns.hasRootAccess(hostname)
                });
            }
        }
        
        return report.sort((a, b) => b.score - a.score);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔓 SERVER CRACKING
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Attempt to crack a server and gain root access
     * 
     * @param {string} hostname - Server to crack
     * @returns {boolean} True if root access gained (or already had)
     */
    crack(hostname) {
        // Already have root?
        if (this.ns.hasRootAccess(hostname)) return true;
        
        // Get server info
        const server = this.getServerData(hostname);
        
        // Check if we can crack it
        if (!this.caps.canCrack(server.numOpenPortsRequired)) {
            return false; // Not enough port openers
        }
        
        // Open ports
        try {
            if (this.caps.brutessh && server.sshPortOpen === false) {
                this.ns.brutessh(hostname);
            }
            if (this.caps.ftpcrack && server.ftpPortOpen === false) {
                this.ns.ftpcrack(hostname);
            }
            if (this.caps.relaysmtp && server.smtpPortOpen === false) {
                this.ns.relaysmtp(hostname);
            }
            if (this.caps.httpworm && server.httpPortOpen === false) {
                this.ns.httpworm(hostname);
            }
            if (this.caps.sqlinject && server.sqlPortOpen === false) {
                this.ns.sqlinject(hostname);
            }
        } catch (e) {
            // Port opening failed - might already be open
        }
        
        // Attempt nuke
        try {
            this.ns.nuke(hostname);
            
            // Clear cached server data (state changed)
            delete this._cache.serverData[hostname];
            delete this._cache.serverDataAge[hostname];
            
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Crack all accessible servers in the network
     * @returns {Object} {cracked: number, failed: number}
     */
    crackAll() {
        const servers = this.refresh();
        let cracked = 0;
        let failed = 0;
        
        for (const hostname of servers) {
            if (!this.ns.hasRootAccess(hostname)) {
                if (this.crack(hostname)) {
                    cracked++;
                } else {
                    failed++;
                }
            }
        }
        
        return { cracked, failed };
    }

    /**
     * Get list of servers we can crack but haven't yet
     * @returns {string[]} Crackable server hostnames
     */
    getCrackable() {
        const servers = this.refresh();
        const crackable = [];
        
        for (const hostname of servers) {
            if (!this.ns.hasRootAccess(hostname)) {
                const server = this.getServerData(hostname);
                if (this.caps.canCrack(server.numOpenPortsRequired)) {
                    crackable.push(hostname);
                }
            }
        }
        
        return crackable;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📊 NETWORK STATISTICS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get network statistics
     * @returns {Object} Network stats
     */
    getNetworkStats() {
        const servers = this.refresh();
        const player = this.ns.getPlayer();
        
        let totalServers = servers.length;
        let rootedServers = 0;
        let hackableServers = 0;
        let crackableServers = 0;
        let purchasedServers = 0;
        let totalRam = 0;
        let usedRam = 0;
        let totalMoney = 0;
        let maxMoney = 0;
        
        for (const hostname of servers) {
            const server = this.getServerData(hostname);
            
            if (this.ns.hasRootAccess(hostname)) rootedServers++;
            if (server.purchasedByPlayer) purchasedServers++;
            
            totalRam += server.maxRam;
            usedRam += server.ramUsed;
            
            if (server.moneyMax > 0) {
                totalMoney += server.moneyAvailable;
                maxMoney += server.moneyMax;
                
                if (server.requiredHackingSkill <= player.skills.hacking) {
                    hackableServers++;
                    
                    if (!this.ns.hasRootAccess(hostname) && 
                        this.caps.canCrack(server.numOpenPortsRequired)) {
                        crackableServers++;
                    }
                }
            }
        }
        
        return {
            totalServers,
            rootedServers,
            hackableServers,
            crackableServers,
            purchasedServers,
            totalRam,
            usedRam,
            freeRam: totalRam - usedRam,
            ramUsagePercent: totalRam > 0 ? (usedRam / totalRam) : 0,
            totalMoney,
            maxMoney,
            moneyPercent: maxMoney > 0 ? (totalMoney / maxMoney) : 0
        };
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache performance stats
     */
    getCacheStats() {
        const totalRequests = this.stats.cacheHits + this.stats.cacheMisses;
        const hitRate = totalRequests > 0 ? (this.stats.cacheHits / totalRequests) : 0;
        
        return {
            totalScans: this.stats.totalScans,
            cacheHits: this.stats.cacheHits,
            cacheMisses: this.stats.cacheMisses,
            hitRate: hitRate,
            hitRatePercent: hitRate * 100
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔍 QUERY METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get all rooted servers
     * @returns {string[]} Rooted server hostnames
     */
    getRooted() {
        const servers = this.refresh();
        return servers.filter(h => this.ns.hasRootAccess(h));
    }

    /**
     * Get servers by minimum RAM
     * @param {number} minRam - Minimum RAM in GB
     * @returns {string[]} Servers with at least minRam GB
     */
    getByMinRam(minRam) {
        const servers = this.refresh();
        return servers.filter(h => {
            const server = this.getServerData(h);
            return server.maxRam >= minRam && this.ns.hasRootAccess(h);
        });
    }

    /**
     * Get purchased servers
     * @returns {string[]} Purchased server hostnames
     */
    getPurchased() {
        const servers = this.refresh();
        return servers.filter(h => {
            const server = this.getServerData(h);
            return server.purchasedByPlayer;
        });
    }

    /**
     * Get servers by hack level requirement
     * @param {number} maxLevel - Maximum required hack level
     * @returns {string[]} Servers hackable at or below maxLevel
     */
    getByHackLevel(maxLevel) {
        const servers = this.refresh();
        return servers.filter(h => {
            const server = this.getServerData(h);
            return server.requiredHackingSkill <= maxLevel && 
                   server.moneyMax > 0 &&
                   this.ns.hasRootAccess(h);
        });
    }

    /**
     * Find servers with specific name pattern
     * @param {string|RegExp} pattern - Search pattern
     * @returns {string[]} Matching server hostnames
     */
    findServers(pattern) {
        const servers = this.refresh();
        const regex = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
        return servers.filter(h => regex.test(h));
    }

    /**
     * Get path from home to target server
     * @param {string} target - Target server
     * @returns {string[]} Array of servers in path (including home and target)
     */
    getPath(target) {
        if (target === "home") return ["home"];
        
        const visited = new Set();
        const queue = [{ server: "home", path: ["home"] }];
        
        while (queue.length > 0) {
            const { server, path } = queue.shift();
            
            if (server === target) {
                return path;
            }
            
            if (visited.has(server)) continue;
            visited.add(server);
            
            const neighbors = this.ns.scan(server);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push({
                        server: neighbor,
                        path: [...path, neighbor]
                    });
                }
            }
        }
        
        return []; // Target not found
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 DISPLAY HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Print network statistics to terminal
     */
    printStats() {
        const stats = this.getNetworkStats();
        const cache = this.getCacheStats();
        
        this.ns.tprint("════════════════════════════════════════");
        this.ns.tprint("🌐 NETWORK STATISTICS");
        this.ns.tprint("════════════════════════════════════════");
        
        this.ns.tprint(`\n📊 SERVERS:`);
        this.ns.tprint(`  Total        : ${stats.totalServers}`);
        this.ns.tprint(`  Rooted       : ${stats.rootedServers}`);
        this.ns.tprint(`  Hackable     : ${stats.hackableServers}`);
        this.ns.tprint(`  Crackable    : ${stats.crackableServers}`);
        this.ns.tprint(`  Purchased    : ${stats.purchasedServers}`);
        
        this.ns.tprint(`\n💾 RAM:`);
        this.ns.tprint(`  Total        : ${this.ns.formatRam(stats.totalRam)}`);
        this.ns.tprint(`  Used         : ${this.ns.formatRam(stats.usedRam)}`);
        this.ns.tprint(`  Free         : ${this.ns.formatRam(stats.freeRam)}`);
        this.ns.tprint(`  Usage        : ${(stats.ramUsagePercent * 100).toFixed(1)}%`);
        
        this.ns.tprint(`\n💰 MONEY:`);
        this.ns.tprint(`  Current      : ${this.ns.formatNumber(stats.totalMoney, "$0.00a")}`);
        this.ns.tprint(`  Maximum      : ${this.ns.formatNumber(stats.maxMoney, "$0.00a")}`);
        this.ns.tprint(`  Percentage   : ${(stats.moneyPercent * 100).toFixed(1)}%`);
        
        this.ns.tprint(`\n⚡ CACHE PERFORMANCE:`);
        this.ns.tprint(`  Total Scans  : ${cache.totalScans}`);
        this.ns.tprint(`  Cache Hits   : ${cache.cacheHits}`);
        this.ns.tprint(`  Cache Misses : ${cache.cacheMisses}`);
        this.ns.tprint(`  Hit Rate     : ${cache.hitRatePercent.toFixed(1)}%`);
        
        this.ns.tprint("\n════════════════════════════════════════");
    }

    /**
     * Print top targets to terminal
     * @param {number} count - Number of targets to show
     */
    printTopTargets(count = 10) {
        const report = this.getScoringReport().slice(0, count);
        
        this.ns.tprint("════════════════════════════════════════");
        this.ns.tprint("🎯 TOP TARGETS");
        this.ns.tprint("════════════════════════════════════════");
        
        for (let i = 0; i < report.length; i++) {
            const server = report[i];
            const rank = (i + 1).toString().padStart(2, " ");
            const name = server.hostname.padEnd(20);
            const score = this.ns.formatNumber(server.score, "0.00a").padStart(8);
            const money = this.ns.formatNumber(server.money, "$0.00a").padStart(10);
            const root = server.hasRoot ? "✅" : "🔒";
            
            this.ns.tprint(`${rank}. ${name} ${root} Score: ${score} Max: ${money}`);
        }
        
        this.ns.tprint("════════════════════════════════════════");
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default Network;

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "The network is your playground - know it well" ⚡
// ═══════════════════════════════════════════════════════════════════════════
