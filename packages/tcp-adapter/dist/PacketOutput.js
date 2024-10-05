"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketOutput = void 0;
const Packet_1 = require("./Packet");
const TcpOutput_1 = require("./TcpOutput");
class PacketOutput extends TcpOutput_1.TcpOutput {
    constructor(packet, adapter) {
        super(adapter);
        this.packet = packet;
    }
    async response(data, type = this.packet.type, slient = false) {
        const packet = new Packet_1.Packet(data, type, this.packet.id);
        return this.send(packet, slient).then(() => packet);
    }
}
exports.PacketOutput = PacketOutput;
//# sourceMappingURL=PacketOutput.js.map