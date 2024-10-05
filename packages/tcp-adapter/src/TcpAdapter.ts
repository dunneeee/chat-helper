import { Socket } from "net";
import { DataReslover } from "./DataReslover";
import EventEmitter from "events";
import { Transformer } from "./Transformer";
import { Packet } from "./Packet";
import { PacketTranformer } from "./PacketTranformer";
import { PacketProcess } from "./PacketProcess";

export interface TcpAdapterContext {
  dataReslover: DataReslover;
  packetTranformer: Transformer<Packet>;
  packetProcess: PacketProcess;
}

export interface TcpAdapterEventMap {
  error: [Error, Packet?];
  disconnect: [boolean];
  packet: [Packet];
  data: [Buffer];
  packet_in_resolving: [Packet];
  packet_out_resolving: [Packet];
}

export class TcpAdapter extends EventEmitter<TcpAdapterEventMap> {
  private dataReslover: DataReslover;
  private packetTranformer: Transformer<Packet>;
  private packetProcess: PacketProcess;
  constructor(
    private socket: Socket,
    context: Partial<TcpAdapterContext> = {}
  ) {
    super();
    this.dataReslover = context.dataReslover || new DataReslover();
    this.packetTranformer = context.packetTranformer || new PacketTranformer();
    this.packetProcess = context.packetProcess || new PacketProcess(this);
    this.init();
  }

  private handleSocketError(error: Error) {
    this.emit("error", error);
  }

  private handleSocetDisconnect(hadError: boolean) {
    this.dataReslover.clearQuietly();
    this.emit("disconnect", hadError);
  }

  private handleSocetData(data: Buffer) {
    this.emit("data", data);
    try {
      const packets = this.packetTranformer.decode(data);
      this.packetProcess.process(packets);
    } catch (error) {
      this.emit("error", new TypeError("INVALID_PACKET"), new Packet(data));
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

  private init() {
    this.socket.on("error", this.handleSocketError.bind(this));

    this.socket.on("close", this.handleSocetDisconnect.bind(this));

    this.socket.on("data", this.handleSocetData.bind(this));
  }
}
