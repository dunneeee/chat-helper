import { Packet } from "./Packet";
import { Transformer } from "./Transformer";
export declare class PacketTranformer implements Transformer<Packet> {
    static LENGTH_HEADER_SIZE: number;
    static EVENT_HEADER_SIZE: number;
    decode<T = any>(data: Buffer): Packet<T | string>[];
    encode(data: Packet): Buffer;
}
