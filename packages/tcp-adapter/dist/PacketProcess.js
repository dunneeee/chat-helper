"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketProcess = void 0;
const Packet_1 = require("./Packet");
class PacketProcess {
    constructor(adapter) {
        this.adapter = adapter;
    }
    process(packets) {
        packets.forEach((packet) => {
            this.adapter.emit("packet", packet);
            this.handle(packet);
        });
    }
    handle(packet) {
        if (packet.id === -1)
            return this.handleSpecialPacket(packet);
        return this.handleNomalPacket(packet);
    }
    handleSpecialPacket(packet) {
        if (packet.type === Packet_1.PacketTypeDefault.Error)
            return this.adapter.emit("error", new Error(packet.data), packet);
        return this.adapter.emit("packet_out_resolving", packet);
    }
    handleNomalPacket(packet) {
        if (packet.type === Packet_1.PacketTypeDefault.Error) {
            const err = new Error(packet.data);
            this.adapter.emit("error", err, packet);
            return this.adapter.getDataReslover().reject(packet.id, err);
        }
        this.adapter.emit("packet_in_resolving", packet);
        return this.adapter.getDataReslover().resolve(packet.id, packet.data);
    }
}
exports.PacketProcess = PacketProcess;
//# sourceMappingURL=PacketProcess.js.map