import { Packet, PacketTypeDefault } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
import { TcpOutput } from "./TcpOutput";

export class PacketOutput extends TcpOutput {
  constructor(private packet: Packet, adapter: TcpAdapter) {
    super(adapter);
  }

  async response<R = any>(
    data: R,
    slient = false,
    type: number = this.packet.type
  ): Promise<Packet<R>> {
    const packet = new Packet(data, type, this.packet.id);
    return this.send(packet, slient).then(() => packet);
  }

  async responseError<R = any>(data: R, slient = false) {
    return this.response(data, slient, PacketTypeDefault.Error);
  }
}
