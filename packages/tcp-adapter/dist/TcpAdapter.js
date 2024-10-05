"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpAdapter = void 0;
const DataReslover_1 = require("./DataReslover");
const events_1 = __importDefault(require("events"));
const Packet_1 = require("./Packet");
const PacketTranformer_1 = require("./PacketTranformer");
const PacketProcess_1 = require("./PacketProcess");
class TcpAdapter extends events_1.default {
    constructor(socket, context = {}) {
        super();
        this.socket = socket;
        this.dataReslover = context.dataReslover || new DataReslover_1.DataReslover();
        this.packetTranformer = context.packetTranformer || new PacketTranformer_1.PacketTranformer();
        this.packetProcess = context.packetProcess || new PacketProcess_1.PacketProcess(this);
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
            this.packetProcess.process(packets);
        }
        catch (error) {
            this.emit("error", new TypeError("INVALID_PACKET"), new Packet_1.Packet(data));
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