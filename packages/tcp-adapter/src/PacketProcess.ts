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
    return this.handleNormalPacket(packet);
  }

  protected handleSpecialPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error)
      return this.adapter.emit("error", packet.data, packet);
    return this.adapter.emit("packet_out_resolving", packet);
  }
  protected handleNormalPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error) {
      const err = packet.data;
      this.adapter.emit("error", err, packet);
      return this.adapter.getDataResolver().reject(packet.id, err);
    }

    this.adapter.emit("packet_in_resolving", packet);
    return this.adapter.getDataResolver().resolve(packet.id, packet.data);
  }
}
