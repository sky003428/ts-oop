function parserInit(): Function {
    const headerLength: number = 4;
    let buf: Buffer = Buffer.alloc(0);

    return (data: Buffer): Content[] => {
        let contentArray: Content[] = [];
        const bufOriginLength = buf.byteLength;

        buf = Buffer.concat([buf, data]);

        while (buf.byteLength > headerLength) {
            const contentLength: number = buf.readUInt32BE(0);
            if (buf.length < contentLength) {
                return [];
            }

            try {
                const content: Content = JSON.parse(
                    buf.subarray(headerLength, headerLength + contentLength).toString()
                );
                contentArray.push(content);
                buf = buf.subarray(headerLength + contentLength);
            } catch (err) {
                console.log("Content isn't JSON serializable");
                buf = buf.subarray(0, bufOriginLength);
                continue;
            }
        }
        return contentArray;
    };
}

export const Parser = parserInit();

export function Packer(data: Content): Buffer {
    const contentBuffer: Buffer = Buffer.from(JSON.stringify(data) + "\r\n");
    const header: Buffer = Buffer.alloc(4);
    header.writeUInt32BE(contentBuffer.byteLength, 0);

    return Buffer.concat([header, contentBuffer]);
}
