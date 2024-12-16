"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true, // Use global APIs like `describe` and `it` without imports
        environment: "node", // Simulates a Node.js environment
    },
});
