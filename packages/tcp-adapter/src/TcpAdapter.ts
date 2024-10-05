import { Socket } from "net";
import { DataReslover } from "./DataReslover";
import EventEmitter from "events";
import { Transformer } from "./Transformer";
import { Packet } from "./Packet";
import { PacketTranformer } from "./PacketTranformer";

export interface TcpAdapterContext {
  dataReslover: DataReslover;
  packetTranformer: Transformer<Packet>;
}

export interface TcpAdapterEventMap {
  error: [Error];
  disconnect: [boolean];
  packet: [Packet];
  data: [Buffer];
  packet_in_resolving: [Packet];
  packet_out_resolving: [Packet];
}

export class TcpAdapter extends EventEmitter<TcpAdapterEventMap> {
  private dataReslover: DataReslover;
  private packetTranformer: Transformer<Packet>;
  constructor(
    private socket: Socket,
    context: Partial<TcpAdapterContext> = {}
  ) {
    super();
    this.dataReslover = context.dataReslover || new DataReslover();
    this.packetTranformer = context.packetTranformer || new PacketTranformer();

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

      packets.forEach((packet) => {
        this.emit("packet", packet);
        if (packet.id !== -1) {
          this.dataReslover.resolve(packet.id, packet.data);
          return this.emit("packet_in_resolving", packet);
        }
        this.emit("packet_out_resolving", packet);
      });
    } catch (error) {
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

  private init() {
    this.socket.on("error", this.handleSocketError.bind(this));

    this.socket.on("close", this.handleSocetDisconnect.bind(this));

    this.socket.on("data", this.handleSocetData.bind(this));
  }
}
