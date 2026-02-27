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
 * @module      lib/utils
 * @version     2.0.0
 * @author      Claude (Anthropic) for @tylersense-ui
 * @license     MIT
 * @description Common utility functions for formatting, calculations, and helpers
 * 
 * @changelog
 *   v2.0.0 - Complete rewrite with speedrun focus
 *            - Added time formatting functions
 *            - Added progress bar generators
 *            - Added sparkline generators
 *            - Added ETA calculators
 *   v1.0.0 - Legacy helpers (basic formatters only)
 * 
 * @requirements
 *   - None (pure functions, no dependencies)
 */

import { UI } from "./constants.js";

// ═══════════════════════════════════════════════════════════════════════════
// 💰 MONEY FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format money with appropriate suffix
 * @param {number} value - Money amount
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted money (e.g., "$1.23m", "$456.78b")
 * 
 * @example
 * formatMoney(1234567)      → "$1.23m"
 * formatMoney(1234567890)   → "$1.23b"
 * formatMoney(50000, 0)     → "$50k"
 */
export function formatMoney(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return "$0";
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    
    if (absValue >= 1e15) return `${sign}$${(absValue / 1e15).toFixed(decimals)}q`;
    if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(decimals)}t`;
    if (absValue >= 1e9)  return `${sign}$${(absValue / 1e9).toFixed(decimals)}b`;
    if (absValue >= 1e6)  return `${sign}$${(absValue / 1e6).toFixed(decimals)}m`;
    if (absValue >= 1e3)  return `${sign}$${(absValue / 1e3).toFixed(decimals)}k`;
    return `${sign}$${absValue.toFixed(0)}`;
}

/**
 * Format money per second rate
 * @param {number} rate - Money per second
 * @returns {string} Formatted rate (e.g., "$1.23m/s")
 * 
 * @example
 * formatMoneyRate(1234567) → "$1.23m/s"
 */
export function formatMoneyRate(rate) {
    return `${formatMoney(rate)}/s`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ⏱️ TIME FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format milliseconds to human-readable time
 * @param {number} ms - Milliseconds
 * @param {boolean} short - Use short format (default: false)
 * @returns {string} Formatted time
 * 
 * @example
 * formatTime(90000)           → "1m 30s"
 * formatTime(90000, true)     → "01:30"
 * formatTime(3661000)         → "1h 1m 1s"
 * formatTime(3661000, true)   → "01:01:01"
 */
export function formatTime(ms, short = false) {
    if (ms === null || ms === undefined || isNaN(ms) || ms < 0) return "0s";
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const s = seconds % 60;
    const m = minutes % 60;
    const h = hours % 24;
    
    if (short) {
        // HH:MM:SS format
        if (days > 0) {
            return `${days}d ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        if (hours > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    // Verbose format
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    
    return parts.join(" ");
}

/**
 * Format time as ETA (always shows hours and minutes)
 * @param {number} ms - Milliseconds until event
 * @returns {string} ETA format (e.g., "2h 15m", "0h 05m")
 * 
 * @example
 * formatETA(7500000)  → "2h 05m"
 * formatETA(180000)   → "0h 03m"
 */
export function formatETA(ms) {
    if (ms === null || ms === undefined || isNaN(ms) || ms <= 0) return "0h 00m";
    
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const m = minutes % 60;
    
    return `${hours}h ${m.toString().padStart(2, '0')}m`;
}

/**
 * Format duration since start
 * @param {number} startTime - Start timestamp (ms)
 * @returns {string} Duration (e.g., "2h 15m 30s")
 * 
 * @example
 * formatDuration(Date.now() - 7500000) → "2h 5m 0s"
 */
export function formatDuration(startTime) {
    return formatTime(Date.now() - startTime);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format large numbers with suffix
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted number (e.g., "1.23k", "456.78m")
 * 
 * @example
 * formatNumber(1234)        → "1.23k"
 * formatNumber(1234567)     → "1.23m"
 * formatNumber(1234567890)  → "1.23b"
 */
export function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return "0";
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    
    if (absValue >= 1e12) return `${sign}${(absValue / 1e12).toFixed(decimals)}t`;
    if (absValue >= 1e9)  return `${sign}${(absValue / 1e9).toFixed(decimals)}b`;
    if (absValue >= 1e6)  return `${sign}${(absValue / 1e6).toFixed(decimals)}m`;
    if (absValue >= 1e3)  return `${sign}${(absValue / 1e3).toFixed(decimals)}k`;
    return `${sign}${absValue.toFixed(decimals)}`;
}

/**
 * Format percentage
 * @param {number} value - Decimal value (0-1)
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted percentage (e.g., "45.2%")
 * 
 * @example
 * formatPercent(0.456)      → "45.6%"
 * formatPercent(0.456, 0)   → "46%"
 */
export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) return "0%";
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format RAM size
 * @param {number} gb - RAM in GB
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted RAM (e.g., "64GB", "1.5TB")
 * 
 * @example
 * formatRAM(64)        → "64GB"
 * formatRAM(1024)      → "1TB"
 * formatRAM(1536, 1)   → "1.5TB"
 */
export function formatRAM(gb, decimals = 0) {
    if (gb === null || gb === undefined || isNaN(gb)) return "0GB";
    
    if (gb >= 1024 * 1024) return `${(gb / (1024 * 1024)).toFixed(decimals)}PB`;
    if (gb >= 1024) return `${(gb / 1024).toFixed(decimals)}TB`;
    return `${gb.toFixed(decimals)}GB`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 PROGRESS BARS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a visual progress bar
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {number} width - Bar width in characters (default: from UI config)
 * @param {boolean} showPercent - Show percentage (default: true)
 * @returns {string} Progress bar string
 * 
 * @example
 * progressBar(45, 100)           → "[████████████████░░░░░░░░] 45%"
 * progressBar(45, 100, 20)       → "[█████████░░░░░░░░░░░] 45%"
 * progressBar(45, 100, 20, false)→ "[█████████░░░░░░░░░░░]"
 */
export function progressBar(current, max, width = UI.PROGRESS.WIDTH, showPercent = true) {
    if (max === 0 || current < 0) return `[${"░".repeat(width)}] 0%`;
    
    const percentage = Math.min(1, Math.max(0, current / max));
    const filled = Math.floor(percentage * width);
    const empty = width - filled;
    
    const bar = `[${UI.PROGRESS.FILL.repeat(filled)}${UI.PROGRESS.EMPTY.repeat(empty)}]`;
    
    if (showPercent) {
        return `${bar} ${(percentage * 100).toFixed(1)}%`;
    }
    return bar;
}

/**
 * Generate a colored progress bar based on thresholds
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {Object} thresholds - Color thresholds { low: 0.3, mid: 0.7 }
 * @param {number} width - Bar width
 * @returns {string} Colored progress bar
 * 
 * @example
 * coloredProgressBar(25, 100)  → Red bar (25%)
 * coloredProgressBar(50, 100)  → Yellow bar (50%)
 * coloredProgressBar(85, 100)  → Green bar (85%)
 */
export function coloredProgressBar(current, max, thresholds = { low: 0.3, mid: 0.7 }, width = UI.PROGRESS.WIDTH) {
    const percentage = current / max;
    let color;
    
    if (percentage < thresholds.low) color = UI.COLORS.ERROR;
    else if (percentage < thresholds.mid) color = UI.COLORS.WARNING;
    else color = UI.COLORS.SUCCESS;
    
    const bar = progressBar(current, max, width, false);
    return `${color}${bar}${UI.COLORS.RESET} ${formatPercent(percentage)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📈 SPARKLINES (Trend Visualization)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a sparkline from data points
 * @param {number[]} data - Array of numeric values
 * @param {number} width - Sparkline width (default: from UI config)
 * @returns {string} Sparkline string
 * 
 * @example
 * sparkline([1, 2, 5, 3, 8, 4, 7])  → "▁▂▅▃█▄▇"
 * sparkline([10, 10, 10])           → "███"
 */
export function sparkline(data, width = UI.SPARKLINE.WIDTH) {
    if (!data || data.length === 0) return "▁".repeat(width);
    
    // Sample data to fit width
    const sampledData = sampleArray(data, width);
    
    // Find min/max
    const min = Math.min(...sampledData);
    const max = Math.max(...sampledData);
    const range = max - min;
    
    if (range === 0) return UI.SPARKLINE.CHARS[UI.SPARKLINE.CHARS.length - 1].repeat(width);
    
    // Map values to sparkline characters
    return sampledData.map(value => {
        const normalized = (value - min) / range;
        const index = Math.floor(normalized * (UI.SPARKLINE.CHARS.length - 1));
        return UI.SPARKLINE.CHARS[index];
    }).join("");
}

/**
 * Sample array to desired length
 * @param {Array} arr - Input array
 * @param {number} targetLength - Desired length
 * @returns {Array} Sampled array
 */
function sampleArray(arr, targetLength) {
    if (arr.length <= targetLength) return arr;
    
    const step = arr.length / targetLength;
    const result = [];
    
    for (let i = 0; i < targetLength; i++) {
        const index = Math.floor(i * step);
        result.push(arr[index]);
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 ETA & PACE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate ETA based on current rate
 * @param {number} current - Current progress
 * @param {number} target - Target value
 * @param {number} rate - Rate per second
 * @returns {number} ETA in milliseconds
 * 
 * @example
 * calculateETA(50000, 100000, 1000)  → 50000 (50 seconds)
 */
export function calculateETA(current, target, rate) {
    if (rate <= 0 || current >= target) return 0;
    const remaining = target - current;
    return (remaining / rate) * 1000; // Convert to ms
}

/**
 * Calculate if on pace with target
 * @param {number} currentTime - Current elapsed time (ms)
 * @param {number} targetTime - Target time (ms)
 * @param {number} progress - Current progress (0-1)
 * @returns {Object} Pace info { onPace, ahead, percentage }
 * 
 * @example
 * calculatePace(60000, 120000, 0.6)  → { onPace: true, ahead: true, percentage: 20 }
 */
export function calculatePace(currentTime, targetTime, progress) {
    const expectedProgress = currentTime / targetTime;
    const diff = progress - expectedProgress;
    const percentage = Math.abs(diff) * 100;
    
    return {
        onPace: Math.abs(diff) < 0.1,      // Within 10%
        ahead: diff > 0,
        behind: diff < 0,
        percentage: percentage,
        critical: percentage > 40
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧮 MATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 * 
 * @example
 * clamp(150, 0, 100)  → 100
 * clamp(-10, 0, 100)  → 0
 * clamp(50, 0, 100)   → 50
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Time (0-1)
 * @returns {number} Interpolated value
 * 
 * @example
 * lerp(0, 100, 0.5)  → 50
 * lerp(0, 100, 0.25) → 25
 */
export function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Calculate moving average
 * @param {number[]} data - Data points
 * @param {number} window - Window size
 * @returns {number} Moving average
 * 
 * @example
 * movingAverage([1, 2, 3, 4, 5], 3)  → 4 (avg of last 3: 3,4,5)
 */
export function movingAverage(data, window = 5) {
    if (data.length === 0) return 0;
    
    const slice = data.slice(-window);
    return slice.reduce((sum, val) => sum + val, 0) / slice.length;
}

/**
 * Calculate rate of change per second
 * @param {number} previous - Previous value
 * @param {number} current - Current value
 * @param {number} deltaTime - Time elapsed (ms)
 * @returns {number} Rate per second
 * 
 * @example
 * ratePerSecond(100, 150, 5000)  → 10 (increased 50 in 5s = 10/s)
 */
export function ratePerSecond(previous, current, deltaTime) {
    if (deltaTime <= 0) return 0;
    return ((current - previous) / deltaTime) * 1000;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 STRING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pad string to length
 * @param {string} str - Input string
 * @param {number} length - Target length
 * @param {string} align - Alignment: "left" | "right" | "center"
 * @returns {string} Padded string
 * 
 * @example
 * pad("test", 10, "left")    → "test      "
 * pad("test", 10, "right")   → "      test"
 * pad("test", 10, "center")  → "   test   "
 */
export function pad(str, length, align = "left") {
    str = String(str);
    if (str.length >= length) return str;
    
    const padding = " ".repeat(length - str.length);
    
    if (align === "right") return padding + str;
    if (align === "center") {
        const leftPad = Math.floor(padding.length / 2);
        const rightPad = padding.length - leftPad;
        return " ".repeat(leftPad) + str + " ".repeat(rightPad);
    }
    return str + padding; // left
}

/**
 * Truncate string with ellipsis
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 * 
 * @example
 * truncate("This is a long string", 10)  → "This is..."
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + "...";
}

/**
 * Colorize text with ANSI color
 * @param {string} text - Text to colorize
 * @param {string} colorKey - Key from UI.COLORS
 * @returns {string} Colored text
 * 
 * @example
 * colorize("Success!", "SUCCESS")  → "\u001b[38;5;46mSuccess!\u001b[0m"
 * colorize("Error!", "ERROR")      → "\u001b[38;5;196mError!\u001b[0m"
 */
export function colorize(text, colorKey) {
    const color = UI.COLORS[colorKey] || "";
    return `${color}${text}${UI.COLORS.RESET}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🗂️ ARRAY UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get top N items from array by property
 * @param {Array} arr - Input array
 * @param {number} n - Number of items
 * @param {string|Function} sortBy - Property name or comparator
 * @returns {Array} Top N items
 * 
 * @example
 * topN([{v:5}, {v:2}, {v:8}], 2, "v")  → [{v:8}, {v:5}]
 */
export function topN(arr, n, sortBy) {
    const sorted = [...arr].sort((a, b) => {
        if (typeof sortBy === "function") return sortBy(b, a);
        return b[sortBy] - a[sortBy];
    });
    return sorted.slice(0, n);
}

/**
 * Group array by property
 * @param {Array} arr - Input array
 * @param {string|Function} key - Property or function
 * @returns {Object} Grouped object
 * 
 * @example
 * groupBy([{type:'a',v:1}, {type:'b',v:2}, {type:'a',v:3}], "type")
 * → { a: [{type:'a',v:1}, {type:'a',v:3}], b: [{type:'b',v:2}] }
 */
export function groupBy(arr, key) {
    return arr.reduce((groups, item) => {
        const groupKey = typeof key === "function" ? key(item) : item[key];
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}

// ═══════════════════════════════════════════════════════════════════════════
// ⏱️ TIMING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Resolves after delay
 * 
 * @example
 * await sleep(1000);  // Wait 1 second
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a simple timer
 * @returns {Object} Timer object with start/stop/elapsed methods
 * 
 * @example
 * const timer = createTimer();
 * timer.start();
 * // ... do work ...
 * console.log(timer.elapsed());  // → elapsed time in ms
 */
export function createTimer() {
    let startTime = null;
    let endTime = null;
    
    return {
        start: () => { startTime = Date.now(); endTime = null; },
        stop: () => { endTime = Date.now(); },
        elapsed: () => {
            if (startTime === null) return 0;
            const end = endTime || Date.now();
            return end - startTime;
        },
        reset: () => { startTime = null; endTime = null; }
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎲 RANDOM UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 * 
 * @example
 * randomInt(1, 10)  → Random number from 1 to 10
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate UUID v4
 * @returns {string} UUID string
 * 
 * @example
 * generateUUID()  → "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if value is valid number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Safely parse number from string
 * @param {string} str - String to parse
 * @param {number} fallback - Fallback value (default: 0)
 * @returns {number} Parsed number or fallback
 * 
 * @example
 * parseNumber("123")    → 123
 * parseNumber("abc", 0) → 0
 */
export function parseNumber(str, fallback = 0) {
    const parsed = Number(str);
    return isValidNumber(parsed) ? parsed : fallback;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export default {
    // Money
    formatMoney,
    formatMoneyRate,
    
    // Time
    formatTime,
    formatETA,
    formatDuration,
    
    // Numbers
    formatNumber,
    formatPercent,
    formatRAM,
    
    // Progress
    progressBar,
    coloredProgressBar,
    sparkline,
    
    // ETA & Pace
    calculateETA,
    calculatePace,
    
    // Math
    clamp,
    lerp,
    movingAverage,
    ratePerSecond,
    
    // Strings
    pad,
    truncate,
    colorize,
    
    // Arrays
    topN,
    groupBy,
    
    // Timing
    sleep,
    createTimer,
    
    // Random
    randomInt,
    generateUUID,
    
    // Validation
    isValidNumber,
    parseNumber
};

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ "Utility is the soul of efficiency" ⚡
// ═══════════════════════════════════════════════════════════════════════════
