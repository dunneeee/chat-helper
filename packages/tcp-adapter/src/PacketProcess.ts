import { Packet, PacketTypeDefault } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";

export class PacketProcess {
  constructor(private adapter: TcpAdapter) {}

  process(packets: Packet[]) {
    packets.forEach((packet) => {
      this.adapter.emit("packet", packet);
      this.handle(packet);
    });
  }

  protected handle(packet: Packet) {
    if (packet.id === -1) return this.handleSpecialPacket(packet);
    return this.handleNomalPacket(packet);
  }

  protected handleSpecialPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error)
      return this.adapter.emit("error", new Error(packet.data), packet);
    return this.adapter.emit("packet_out_resolving", packet);
  }
  protected handleNomalPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error) {
      const err = new Error(packet.data);
      this.adapter.emit("error", err, packet);
      return this.adapter.getDataReslover().reject(packet.id, err);
    }

    this.adapter.emit("packet_in_resolving", packet);
    return this.adapter.getDataReslover().resolve(packet.id, packet.data);
  }
}
