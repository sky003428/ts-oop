"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packer = exports.Parser = void 0;
function parserInit() {
    const headerLength = 4;
    let buf = Buffer.alloc(0);
    return (data) => {
        let contentArray = [];
        const bufOriginLength = buf.byteLength;
        buf = Buffer.concat([buf, data]);
        while (buf.byteLength > headerLength) {
            const contentLength = buf.readUInt32BE(0);
            if (buf.length < contentLength) {
                return [];
            }
            try {
                const content = JSON.parse(buf.subarray(headerLength, headerLength + contentLength).toString());
                contentArray.push(content);
                buf = buf.subarray(headerLength + contentLength);
            }
            catch (err) {
                console.log("Content isn't JSON serializable");
                buf = buf.subarray(0, bufOriginLength);
                continue;
            }
        }
        return contentArray;
    };
}
exports.Parser = parserInit();
function Packer(data) {
    const contentBuffer = Buffer.from(JSON.stringify(data) + "\r\n");
    const header = Buffer.alloc(4);
    header.writeUInt32BE(contentBuffer.byteLength, 0);
    return Buffer.concat([header, contentBuffer]);
}
exports.Packer = Packer;
