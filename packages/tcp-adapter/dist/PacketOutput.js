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
    async response(data, slient = false, type = this.packet.type) {
        const packet = new Packet_1.Packet(data, type, this.packet.id);
        return this.send(packet, slient).then(() => packet);
    }
    async responseError(data, slient = false) {
        return this.response(data, slient, Packet_1.PacketTypeDefault.Error);
    }
}
exports.PacketOutput = PacketOutput;
//# sourceMappingURL=PacketOutput.js.map