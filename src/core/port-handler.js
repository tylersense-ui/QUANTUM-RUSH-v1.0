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
 * @module      core/port-handler
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Inter-Process Communication via Netscript ports
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite with advanced features
 *            - Added JSON serialization/deserialization
 *            - Added queue management (peek all, drain)
 *            - Added port status checking
 *            - Added retry logic for full ports
 *            - Added batch operations
 *            - Safe error handling
 *   v1.0.0 - Legacy basic port wrapper
 * 
 * @requirements
 *   - None (pure wrapper around ns.ports)
 * 
 * @example
 * const ph = new PortHandler(ns);
 * 
 * // Write command
 * ph.writeJSON(4, { type: "hack", target: "n00dles" });
 * 
 * // Read command
 * const cmd = ph.readJSON(4);
 * if (cmd) {
 *   // Process command
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔌 PORT HANDLER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class PortHandler {
    /**
     * Create a port handler
     * @param {NS} ns - Netscript object
     */
    constructor(ns) {
        this.ns = ns;
        
        // Configuration
        this.config = {
            maxRetries: 3,          // Max retries for full ports
            retryDelay: 50,         // Delay between retries (ms)
            enableDebug: false      // Debug logging
        };
        
        // Statistics
        this.stats = {
            reads: 0,
            writes: 0,
            writeFailures: 0,
            readFailures: 0,
            jsonParseErrors: 0
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📖 READ OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Read data from port (blocking)
     * @param {number} portId - Port number (1-20)
     * @returns {*} Data from port (or "NULL PORT DATA" if empty)
     */
    read(portId) {
        try {
            const data = this.ns.readPort(portId);
            this.stats.reads++;
            return data;
        } catch (e) {
            this.stats.readFailures++;
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ Port read error [${portId}]: ${e}`);
            }
            return "NULL PORT DATA";
        }
    }

    /**
     * Peek at port data without removing it
     * @param {number} portId - Port number
     * @returns {*} Data from port (doesn't remove it)
     */
    peek(portId) {
        try {
            return this.ns.peek(portId);
        } catch (e) {
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ Port peek error [${portId}]: ${e}`);
            }
            return "NULL PORT DATA";
        }
    }

    /**
     * Check if port is empty
     * @param {number} portId - Port number
     * @returns {boolean} True if port is empty
     */
    isEmpty(portId) {
        return this.peek(portId) === "NULL PORT DATA";
    }

    /**
     * Check if port has data
     * @param {number} portId - Port number
     * @returns {boolean} True if port has data
     */
    hasData(portId) {
        return !this.isEmpty(portId);
    }

    /**
     * Read all data from port (drain)
     * @param {number} portId - Port number
     * @returns {Array} Array of all data in port
     */
    readAll(portId) {
        const data = [];
        
        while (!this.isEmpty(portId)) {
            const item = this.read(portId);
            if (item !== "NULL PORT DATA") {
                data.push(item);
            }
        }
        
        return data;
    }

    /**
     * Peek at all data in port without removing
     * @param {number} portId - Port number
     * @returns {Array} Array of all data in port
     */
    peekAll(portId) {
        const data = [];
        const temp = [];
        
        // Read all
        while (!this.isEmpty(portId)) {
            const item = this.read(portId);
            if (item !== "NULL PORT DATA") {
                data.push(item);
                temp.push(item);
            }
        }
        
        // Write back
        for (const item of temp) {
            this.write(portId, item);
        }
        
        return data;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ✍️ WRITE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Write data to port (with retry on full)
     * @param {number} portId - Port number
     * @param {*} data - Data to write
     * @returns {boolean} True if write succeeded
     */
    write(portId, data) {
        let retries = 0;
        
        while (retries < this.config.maxRetries) {
            try {
                const success = this.ns.tryWritePort(portId, data);
                
                if (success) {
                    this.stats.writes++;
                    return true;
                }
                
                // Port full - retry
                retries++;
                if (retries < this.config.maxRetries) {
                    // Wait a bit before retry
                    this.ns.asleep(this.config.retryDelay);
                }
            } catch (e) {
                this.stats.writeFailures++;
                if (this.config.enableDebug) {
                    this.ns.print(`⚠️ Port write error [${portId}]: ${e}`);
                }
                return false;
            }
        }
        
        // Failed after retries
        this.stats.writeFailures++;
        if (this.config.enableDebug) {
            this.ns.print(`⚠️ Port ${portId} full after ${this.config.maxRetries} retries`);
        }
        return false;
    }

    /**
     * Write multiple items to port
     * @param {number} portId - Port number
     * @param {Array} items - Array of items to write
     * @returns {number} Number of items successfully written
     */
    writeAll(portId, items) {
        let written = 0;
        
        for (const item of items) {
            if (this.write(portId, item)) {
                written++;
            } else {
                break; // Stop on first failure
            }
        }
        
        return written;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📦 JSON OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Write JSON object to port
     * @param {number} portId - Port number
     * @param {Object} obj - Object to serialize and write
     * @returns {boolean} True if write succeeded
     */
    writeJSON(portId, obj) {
        try {
            const json = JSON.stringify(obj);
            return this.write(portId, json);
        } catch (e) {
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ JSON stringify error [${portId}]: ${e}`);
            }
            return false;
        }
    }

    /**
     * Read and parse JSON from port
     * @param {number} portId - Port number
     * @returns {Object|null} Parsed object or null on failure
     */
    readJSON(portId) {
        const data = this.read(portId);
        
        if (data === "NULL PORT DATA" || !data) {
            return null;
        }
        
        try {
            return JSON.parse(data);
        } catch (e) {
            this.stats.jsonParseErrors++;
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ JSON parse error [${portId}]: ${e}`);
                this.ns.print(`   Data: ${data}`);
            }
            return null;
        }
    }

    /**
     * Peek at JSON data without removing
     * @param {number} portId - Port number
     * @returns {Object|null} Parsed object or null
     */
    peekJSON(portId) {
        const data = this.peek(portId);
        
        if (data === "NULL PORT DATA" || !data) {
            return null;
        }
        
        try {
            return JSON.parse(data);
        } catch (e) {
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ JSON parse error (peek) [${portId}]: ${e}`);
            }
            return null;
        }
    }

    /**
     * Read all JSON objects from port
     * @param {number} portId - Port number
     * @returns {Array} Array of parsed objects
     */
    readAllJSON(portId) {
        const items = this.readAll(portId);
        const parsed = [];
        
        for (const item of items) {
            try {
                parsed.push(JSON.parse(item));
            } catch (e) {
                this.stats.jsonParseErrors++;
                if (this.config.enableDebug) {
                    this.ns.print(`⚠️ JSON parse error in readAllJSON [${portId}]`);
                }
            }
        }
        
        return parsed;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🗑️ CLEAR & RESET OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Clear all data from port
     * @param {number} portId - Port number
     */
    clear(portId) {
        try {
            this.ns.clearPort(portId);
        } catch (e) {
            if (this.config.enableDebug) {
                this.ns.print(`⚠️ Port clear error [${portId}]: ${e}`);
            }
        }
    }

    /**
     * Clear multiple ports
     * @param {number[]} portIds - Array of port numbers
     */
    clearAll(portIds) {
        for (const portId of portIds) {
            this.clear(portId);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📊 PORT STATUS & DIAGNOSTICS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get port status information
     * @param {number} portId - Port number
     * @returns {Object} Port status
     */
    getStatus(portId) {
        const empty = this.isEmpty(portId);
        const firstItem = empty ? null : this.peek(portId);
        
        return {
            portId: portId,
            isEmpty: empty,
            hasData: !empty,
            firstItem: firstItem,
            firstItemType: firstItem ? typeof firstItem : null
        };
    }

    /**
     * Get detailed port information
     * @param {number} portId - Port number
     * @returns {Object} Detailed info
     */
    getInfo(portId) {
        const status = this.getStatus(portId);
        const allData = this.peekAll(portId);
        
        return {
            ...status,
            itemCount: allData.length,
            items: allData
        };
    }

    /**
     * Get statistics
     * @returns {Object} Handler statistics
     */
    getStats() {
        return {
            ...this.stats,
            totalOperations: this.stats.reads + this.stats.writes,
            readSuccessRate: this.stats.reads > 0 
                ? ((this.stats.reads / (this.stats.reads + this.stats.readFailures)) * 100)
                : 100,
            writeSuccessRate: this.stats.writes > 0
                ? ((this.stats.writes / (this.stats.writes + this.stats.writeFailures)) * 100)
                : 100
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            reads: 0,
            writes: 0,
            writeFailures: 0,
            readFailures: 0,
            jsonParseErrors: 0
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Set maximum retries for full ports
     * @param {number} retries - Max retries
     */
    setMaxRetries(retries) {
        this.config.maxRetries = retries;
    }

    /**
     * Set retry delay
     * @param {number} delay - Delay in milliseconds
     */
    setRetryDelay(delay) {
        this.config.retryDelay = delay;
    }

    /**
     * Enable debug logging
     */
    enableDebug() {
        this.config.enableDebug = true;
    }

    /**
     * Disable debug logging
     */
    disableDebug() {
        this.config.enableDebug = false;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 DISPLAY HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Print port status to console
     * @param {number} portId - Port number
     */
    printStatus(portId) {
        const info = this.getInfo(portId);
        
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`📡 PORT ${portId} STATUS`);
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`  Empty       : ${info.isEmpty ? "Yes" : "No"}`);
        this.ns.print(`  Item Count  : ${info.itemCount}`);
        
        if (info.itemCount > 0) {
            this.ns.print(`  First Item  : ${info.firstItem}`);
            this.ns.print(`  Type        : ${info.firstItemType}`);
        }
        
        this.ns.print("════════════════════════════════════════");
    }

    /**
     * Print handler statistics
     */
    printStats() {
        const stats = this.getStats();
        
        this.ns.print("════════════════════════════════════════");
        this.ns.print("📊 PORT HANDLER STATISTICS");
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`  Reads          : ${stats.reads}`);
        this.ns.print(`  Writes         : ${stats.writes}`);
        this.ns.print(`  Read Failures  : ${stats.readFailures}`);
        this.ns.print(`  Write Failures : ${stats.writeFailures}`);
        this.ns.print(`  JSON Errors    : ${stats.jsonParseErrors}`);
        this.ns.print(`  ─────────────────────`);
        this.ns.print(`  Total Ops      : ${stats.totalOperations}`);
        this.ns.print(`  Read Success   : ${stats.readSuccessRate.toFixed(1)}%`);
        this.ns.print(`  Write Success  : ${stats.writeSuccessRate.toFixed(1)}%`);
        this.ns.print("════════════════════════════════════════");
    }

    /**
     * Print contents of a port (debug helper)
     * @param {number} portId - Port number
     * @param {number} maxItems - Max items to display (default: 10)
     */
    printContents(portId, maxItems = 10) {
        const items = this.peekAll(portId);
        
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`📋 PORT ${portId} CONTENTS (${items.length} items)`);
        this.ns.print("════════════════════════════════════════");
        
        const display = items.slice(0, maxItems);
        for (let i = 0; i < display.length; i++) {
            const item = display[i];
            const preview = typeof item === "string" && item.length > 50
                ? item.substring(0, 50) + "..."
                : item;
            this.ns.print(`  ${i + 1}. ${preview}`);
        }
        
        if (items.length > maxItems) {
            this.ns.print(`  ... and ${items.length - maxItems} more`);
        }
        
        this.ns.print("════════════════════════════════════════");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🚀 CONVENIENCE METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Wait until port has data
     * @param {number} portId - Port number
     * @param {number} timeout - Timeout in ms (default: 10000)
     * @returns {Promise<boolean>} True if data appeared, false if timeout
     */
    async waitForData(portId, timeout = 10000) {
        const startTime = Date.now();
        
        while (this.isEmpty(portId)) {
            if (Date.now() - startTime > timeout) {
                return false; // Timeout
            }
            await this.ns.sleep(100);
        }
        
        return true;
    }

    /**
     * Wait until port is empty
     * @param {number} portId - Port number
     * @param {number} timeout - Timeout in ms (default: 10000)
     * @returns {Promise<boolean>} True if empty, false if timeout
     */
    async waitForEmpty(portId, timeout = 10000) {
        const startTime = Date.now();
        
        while (!this.isEmpty(portId)) {
            if (Date.now() - startTime > timeout) {
                return false; // Timeout
            }
            await this.ns.sleep(100);
        }
        
        return true;
    }

    /**
     * Try to read with timeout
     * @param {number} portId - Port number
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<*>} Data or null if timeout
     */
    async readWithTimeout(portId, timeout = 5000) {
        const hasData = await this.waitForData(portId, timeout);
        return hasData ? this.read(portId) : null;
    }

    /**
     * Process all items in port with callback
     * @param {number} portId - Port number
     * @param {Function} callback - Function to call for each item
     */
    processAll(portId, callback) {
        while (!this.isEmpty(portId)) {
            const item = this.read(portId);
            if (item !== "NULL PORT DATA") {
                callback(item);
            }
        }
    }

    /**
     * Process all JSON items in port with callback
     * @param {number} portId - Port number
     * @param {Function} callback - Function to call for each parsed object
     */
    processAllJSON(portId, callback) {
        while (!this.isEmpty(portId)) {
            const obj = this.readJSON(portId);
            if (obj !== null) {
                callback(obj);
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default PortHandler;

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "Communication is the key to coordination" ⚡
// ═══════════════════════════════════════════════════════════════════════════
