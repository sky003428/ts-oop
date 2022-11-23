"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Packer(data) {
    const contentBuffer = Buffer.from(JSON.stringify(data) + "\r\n");
    const header = Buffer.alloc(4);
    header.writeUInt32BE(contentBuffer.byteLength, 0);
    return Buffer.concat([header, contentBuffer]);
}
exports.default = Packer;
