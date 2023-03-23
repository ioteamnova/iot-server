"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestMode = exports.isLocalMode = exports.isDevelopMode = exports.isProductionMode = void 0;
exports.isProductionMode = process.env.NODE_ENV === 'prod';
exports.isDevelopMode = process.env.NODE_ENV === 'dev';
exports.isLocalMode = process.env.NODE_ENV === 'local' ||
    process.env.NODE_ENV === 'test' ||
    process.env.LOCAL_MODE === 'true';
exports.isTestMode = process.env.NODE_ENV === 'test';
//# sourceMappingURL=app-utils.js.map