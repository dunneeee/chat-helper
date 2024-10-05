"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpOutput = void 0;
const Packet_1 = require("./Packet");
class TcpOutput {
    constructor(adapter) {
        this.adapter = adapter;
    }
    async send(packetOrData, silent = false) {
        const packet = packetOrData instanceof Packet_1.Packet ? packetOrData : new Packet_1.Packet(packetOrData);
        return new Promise((resolve, reject) => {
            if (!this.adapter.canWrite()) {
                return silent ? resolve() : reject(new Error("CANNOT_WRITE"));
            }
            const socket = this.adapter.getSocket();
            const data = this.adapter.getPacketTranformer().encode(packet);
            socket.write(data, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }
    async request(packetOrData, type = Packet_1.PacketTypeDefault.Data) {
        const packet = packetOrData instanceof Packet_1.Packet
            ? packetOrData
            : new Packet_1.Packet(packetOrData, type);
        return new Promise((resolve, reject) => {
            const id = this.adapter.getDataReslover().register(resolve, reject);
            packet.id = id;
            this.send(packet, false).catch(reject);
        });
    }
}
exports.TcpOutput = TcpOutput;
//# sourceMappingURL=TcpOutput.js.map