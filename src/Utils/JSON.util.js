"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONUtil {
    parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (e) {
            return false;
        }
    }
}
exports.default = JSONUtil;
