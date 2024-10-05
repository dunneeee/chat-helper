"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpAdapter = void 0;
const DataReslover_1 = require("./DataReslover");
const events_1 = __importDefault(require("events"));
const PacketTranformer_1 = require("./PacketTranformer");
class TcpAdapter extends events_1.default {
    constructor(socket, context = {}) {
        super();
        this.socket = socket;
        this.dataReslover = context.dataReslover || new DataReslover_1.DataReslover();
        this.packetTranformer = context.packetTranformer || new PacketTranformer_1.PacketTranformer();
        this.init();
    }
    handleSocketError(error) {
        this.emit("error", error);
    }
    handleSocetDisconnect(hadError) {
        this.dataReslover.clearQuietly();
        this.emit("disconnect", hadError);
    }
    handleSocetData(data) {
        this.emit("data", data);
        try {
            const packets = this.packetTranformer.decode(data);
            packets.forEach((packet) => {
                this.emit("packet", packet);
                if (packet.id !== -1) {
                    this.dataReslover.resolve(packet.id, packet.data);
                    return this.emit("packet_in_resolving", packet);
                }
                this.emit("packet_out_resolving", packet);
            });
        }
        catch (error) {
            this.emit("error", new TypeError("INVALID_PACKET"));
        }
    }
    canWrite() {
        return !this.socket.destroyed;
    }
    getSocket() {
        return this.socket;
    }
    getDataReslover() {
        return this.dataReslover;
    }
    getPacketTranformer() {
        return this.packetTranformer;
    }
    init() {
        this.socket.on("error", this.handleSocketError.bind(this));
        this.socket.on("close", this.handleSocetDisconnect.bind(this));
        this.socket.on("data", this.handleSocetData.bind(this));
    }
}
exports.TcpAdapter = TcpAdapter;
//# sourceMappingURL=TcpAdapter.js.map