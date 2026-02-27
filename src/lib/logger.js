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
 * @module      lib/logger
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Centralized logging system with levels, colors, and filtering
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite with advanced features
 *            - Added log levels (DEBUG/INFO/WARN/ERROR/SUCCESS)
 *            - Added color-coded output
 *            - Added timestamp formatting
 *            - Added module-specific prefixes
 *            - Added toast notifications for errors
 *            - Added log history tracking
 *            - Added file logging support
 *   v1.0.0 - Legacy basic logger
 * 
 * @requirements
 *   - lib/constants.js (for colors and config)
 * 
 * @example
 * const log = new Logger(ns, "BATCHER");
 * log.info("Batch dispatched");
 * log.error("Failed to execute");
 * log.success("Target rooted!");
 */

import { UI, SYSTEM } from "./constants.js";

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 LOG LEVELS
// ═══════════════════════════════════════════════════════════════════════════

export const LOG_LEVEL = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SUCCESS: 4
};

const LOG_LEVEL_NAMES = {
    0: "DEBUG",
    1: "INFO",
    2: "WARN",
    3: "ERROR",
    4: "SUCCESS"
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 LOGGER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class Logger {
    /**
     * Create a logger instance
     * @param {NS} ns - Netscript object
     * @param {string} moduleName - Module name for prefixing logs
     * @param {number} minLevel - Minimum log level to display (default: from config)
     */
    constructor(ns, moduleName = "SYSTEM", minLevel = null) {
        this.ns = ns;
        this.moduleName = moduleName.toUpperCase();
        
        // Set minimum log level
        if (minLevel !== null) {
            this.minLevel = minLevel;
        } else {
            // Parse from config
            const configLevel = SYSTEM.LOG_LEVEL || "INFO";
            this.minLevel = LOG_LEVEL[configLevel] || LOG_LEVEL.INFO;
        }
        
        // Enable debug mode if configured
        this.debugEnabled = SYSTEM.DEBUG_MODE || false;
        
        // Log history (keep last 100 entries)
        this.history = [];
        this.maxHistory = 100;
        
        // File logging
        this.fileLogging = SYSTEM.LOG_TO_FILE || false;
        this.logFile = `/logs/${this.moduleName.toLowerCase()}.txt`;
        
        // Statistics
        this.stats = {
            debug: 0,
            info: 0,
            warn: 0,
            error: 0,
            success: 0
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎯 CORE LOGGING METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Log a debug message
     * @param {string} message - Message to log
     * @param {Object} data - Optional data object
     */
    debug(message, data = null) {
        if (!this.debugEnabled) return;
        this._log(LOG_LEVEL.DEBUG, message, data);
        this.stats.debug++;
    }

    /**
     * Log an info message
     * @param {string} message - Message to log
     * @param {Object} data - Optional data object
     */
    info(message, data = null) {
        this._log(LOG_LEVEL.INFO, message, data);
        this.stats.info++;
    }

    /**
     * Log a warning message
     * @param {string} message - Message to log
     * @param {Object} data - Optional data object
     */
    warn(message, data = null) {
        this._log(LOG_LEVEL.WARN, message, data);
        this.stats.warn++;
    }

    /**
     * Log an error message (also shows toast notification)
     * @param {string} message - Message to log
     * @param {Object} data - Optional data object
     */
    error(message, data = null) {
        this._log(LOG_LEVEL.ERROR, message, data);
        this.stats.error++;
        
        // Show toast notification for errors
        try {
            this.ns.toast(`[${this.moduleName}] ${message}`, "error", 5000);
        } catch (e) {
            // Toast failed - not critical
        }
    }

    /**
     * Log a success message
     * @param {string} message - Message to log
     * @param {Object} data - Optional data object
     */
    success(message, data = null) {
        this._log(LOG_LEVEL.SUCCESS, message, data);
        this.stats.success++;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔧 INTERNAL LOGGING ENGINE
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Internal logging implementation
     * @private
     * @param {number} level - Log level
     * @param {string} message - Message
     * @param {Object} data - Optional data
     */
    _log(level, message, data = null) {
        // Check if we should log this level
        if (level < this.minLevel) return;
        
        // Build log entry
        const entry = this._buildEntry(level, message, data);
        
        // Add to history
        this._addToHistory(entry);
        
        // Output to console
        this._output(entry);
        
        // Write to file if enabled
        if (this.fileLogging) {
            this._writeToFile(entry);
        }
    }

    /**
     * Build log entry object
     * @private
     * @param {number} level - Log level
     * @param {string} message - Message
     * @param {Object} data - Optional data
     * @returns {Object} Log entry
     */
    _buildEntry(level, message, data) {
        const timestamp = new Date();
        const levelName = LOG_LEVEL_NAMES[level];
        
        return {
            timestamp: timestamp,
            level: level,
            levelName: levelName,
            module: this.moduleName,
            message: message,
            data: data,
            formatted: this._format(timestamp, levelName, message)
        };
    }

    /**
     * Format log message with timestamp and colors
     * @private
     * @param {Date} timestamp - Timestamp
     * @param {string} level - Level name
     * @param {string} message - Message
     * @returns {string} Formatted message
     */
    _format(timestamp, level, message) {
        // Get time string (HH:MM:SS)
        const timeStr = timestamp.toLocaleTimeString("en-US", { 
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        // Get color for level
        const color = this._getLevelColor(level);
        const icon = this._getLevelIcon(level);
        
        // Format: [HH:MM:SS][MODULE][LEVEL] message
        const prefix = `[${timeStr}][${this.moduleName}][${level}]`;
        const coloredPrefix = `${color}${prefix}${UI.COLORS.RESET}`;
        
        return `${icon} ${coloredPrefix} ${message}`;
    }

    /**
     * Get color for log level
     * @private
     * @param {string} level - Level name
     * @returns {string} ANSI color code
     */
    _getLevelColor(level) {
        switch (level) {
            case "DEBUG":
                return UI.COLORS.DEBUG;
            case "INFO":
                return UI.COLORS.INFO;
            case "WARN":
                return UI.COLORS.WARNING;
            case "ERROR":
                return UI.COLORS.ERROR;
            case "SUCCESS":
                return UI.COLORS.SUCCESS;
            default:
                return UI.COLORS.RESET;
        }
    }

    /**
     * Get icon for log level
     * @private
     * @param {string} level - Level name
     * @returns {string} Emoji icon
     */
    _getLevelIcon(level) {
        switch (level) {
            case "DEBUG":
                return "🔍";
            case "INFO":
                return UI.ICONS.INFO;
            case "WARN":
                return UI.ICONS.WARNING;
            case "ERROR":
                return UI.ICONS.ERROR;
            case "SUCCESS":
                return UI.ICONS.SUCCESS;
            default:
                return "📝";
        }
    }

    /**
     * Output log entry to console
     * @private
     * @param {Object} entry - Log entry
     */
    _output(entry) {
        this.ns.print(entry.formatted);
        
        // Also print data if present
        if (entry.data) {
            try {
                const dataStr = JSON.stringify(entry.data, null, 2);
                this.ns.print(`  ${UI.COLORS.DEBUG}${dataStr}${UI.COLORS.RESET}`);
            } catch (e) {
                // JSON stringify failed - just show object
                this.ns.print(`  ${UI.COLORS.DEBUG}[Object]${UI.COLORS.RESET}`);
            }
        }
    }

    /**
     * Write log entry to file
     * @private
     * @param {Object} entry - Log entry
     */
    _writeToFile(entry) {
        try {
            // Strip ANSI colors for file output
            const plainText = entry.formatted.replace(/\u001b\[[\d;]*m/g, "");
            const line = `${plainText}\n`;
            
            // Append to file
            this.ns.write(this.logFile, line, "a");
        } catch (e) {
            // File write failed - not critical
        }
    }

    /**
     * Add entry to history
     * @private
     * @param {Object} entry - Log entry
     */
    _addToHistory(entry) {
        this.history.push(entry);
        
        // Trim history if too long
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 📊 HISTORY & STATISTICS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get log history
     * @param {number} count - Number of recent entries (default: all)
     * @returns {Object[]} Log entries
     */
    getHistory(count = null) {
        if (count === null) {
            return [...this.history];
        }
        return this.history.slice(-count);
    }

    /**
     * Get logs filtered by level
     * @param {number} level - Log level
     * @returns {Object[]} Filtered log entries
     */
    getByLevel(level) {
        return this.history.filter(entry => entry.level === level);
    }

    /**
     * Get error logs
     * @returns {Object[]} Error log entries
     */
    getErrors() {
        return this.getByLevel(LOG_LEVEL.ERROR);
    }

    /**
     * Get warning logs
     * @returns {Object[]} Warning log entries
     */
    getWarnings() {
        return this.getByLevel(LOG_LEVEL.WARN);
    }

    /**
     * Clear log history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Get logging statistics
     * @returns {Object} Stats
     */
    getStats() {
        return {
            ...this.stats,
            total: Object.values(this.stats).reduce((sum, val) => sum + val, 0),
            historySize: this.history.length
        };
    }

    /**
     * Print statistics to console
     */
    printStats() {
        const stats = this.getStats();
        
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`📊 LOGGING STATISTICS [${this.moduleName}]`);
        this.ns.print("════════════════════════════════════════");
        this.ns.print(`  Debug    : ${stats.debug}`);
        this.ns.print(`  Info     : ${stats.info}`);
        this.ns.print(`  Warnings : ${stats.warn}`);
        this.ns.print(`  Errors   : ${stats.error}`);
        this.ns.print(`  Success  : ${stats.success}`);
        this.ns.print(`  ─────────────────────`);
        this.ns.print(`  Total    : ${stats.total}`);
        this.ns.print(`  History  : ${stats.historySize} entries`);
        this.ns.print("════════════════════════════════════════");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Set minimum log level
     * @param {number|string} level - Log level (number or name)
     */
    setLevel(level) {
        if (typeof level === "string") {
            this.minLevel = LOG_LEVEL[level.toUpperCase()] || LOG_LEVEL.INFO;
        } else {
            this.minLevel = level;
        }
    }

    /**
     * Enable debug mode
     */
    enableDebug() {
        this.debugEnabled = true;
    }

    /**
     * Disable debug mode
     */
    disableDebug() {
        this.debugEnabled = false;
    }

    /**
     * Enable file logging
     */
    enableFileLogging() {
        this.fileLogging = true;
    }

    /**
     * Disable file logging
     */
    disableFileLogging() {
        this.fileLogging = false;
    }

    /**
     * Set log file path
     * @param {string} path - File path
     */
    setLogFile(path) {
        this.logFile = path;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 DISPLAY HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Print a separator line
     * @param {string} char - Character to use (default: "═")
     * @param {number} length - Line length (default: 40)
     */
    separator(char = "═", length = 40) {
        this.ns.print(char.repeat(length));
    }

    /**
     * Print a header
     * @param {string} text - Header text
     */
    header(text) {
        this.separator();
        this.info(text);
        this.separator();
    }

    /**
     * Print a section
     * @param {string} title - Section title
     */
    section(title) {
        this.ns.print("");
        this.info(`── ${title} ──`);
    }

    /**
     * Print a blank line
     */
    blank() {
        this.ns.print("");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🚀 CONVENIENCE METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Log and return a value (useful for debugging)
     * @param {string} label - Label for the value
     * @param {*} value - Value to log and return
     * @returns {*} The value (unchanged)
     */
    trace(label, value) {
        this.debug(`${label}: ${value}`);
        return value;
    }

    /**
     * Log function entry
     * @param {string} funcName - Function name
     * @param {Object} args - Function arguments
     */
    enter(funcName, args = null) {
        this.debug(`→ Entering ${funcName}`, args);
    }

    /**
     * Log function exit
     * @param {string} funcName - Function name
     * @param {*} result - Return value
     */
    exit(funcName, result = null) {
        this.debug(`← Exiting ${funcName}`, result);
    }

    /**
     * Log a performance measurement
     * @param {string} label - Operation label
     * @param {number} startTime - Start timestamp (ms)
     */
    perf(label, startTime) {
        const elapsed = Date.now() - startTime;
        this.debug(`⚡ ${label}: ${elapsed}ms`);
    }

    /**
     * Log an assertion failure
     * @param {boolean} condition - Condition to check
     * @param {string} message - Error message if false
     */
    assert(condition, message) {
        if (!condition) {
            this.error(`Assertion failed: ${message}`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 GLOBAL LOGGER INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

let globalLogger = null;

/**
 * Get or create global logger
 * @param {NS} ns - Netscript object
 * @returns {Logger} Global logger instance
 */
export function getGlobalLogger(ns) {
    if (!globalLogger) {
        globalLogger = new Logger(ns, "GLOBAL");
    }
    return globalLogger;
}

/**
 * Quick log functions (use global logger)
 */
export function logDebug(ns, message, data = null) {
    getGlobalLogger(ns).debug(message, data);
}

export function logInfo(ns, message, data = null) {
    getGlobalLogger(ns).info(message, data);
}

export function logWarn(ns, message, data = null) {
    getGlobalLogger(ns).warn(message, data);
}

export function logError(ns, message, data = null) {
    getGlobalLogger(ns).error(message, data);
}

export function logSuccess(ns, message, data = null) {
    getGlobalLogger(ns).success(message, data);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default Logger;

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "Good logs are the foundation of good debugging" ⚡
// ═══════════════════════════════════════════════════════════════════════════
