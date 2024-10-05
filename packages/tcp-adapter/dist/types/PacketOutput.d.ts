import { Packet } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
import { TcpOutput } from "./TcpOutput";
export declare class PacketOutput extends TcpOutput {
    private packet;
    constructor(packet: Packet, adapter: TcpAdapter);
    response<R = any>(data: R, type?: number, slient?: boolean): Promise<Packet<R>>;
}
