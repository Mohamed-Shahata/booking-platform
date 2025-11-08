"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = void 0;
const generateRoomId = () => {
    return "room_" + Math.random().toString(36).substring(2, 10);
};
exports.generateRoomId = generateRoomId;
