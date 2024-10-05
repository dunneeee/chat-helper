import { Socket } from "net";
import { DataReslover } from "./DataReslover";
import EventEmitter from "events";
import { Transformer } from "./Transformer";
import { Packet } from "./Packet";
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
export declare class TcpAdapter extends EventEmitter<TcpAdapterEventMap> {
    private socket;
    private dataReslover;
    private packetTranformer;
    constructor(socket: Socket, context?: Partial<TcpAdapterContext>);
    private handleSocketError;
    private handleSocetDisconnect;
    private handleSocetData;
    canWrite(): boolean;
    getSocket(): Socket;
    getDataReslover(): DataReslover;
    getPacketTranformer(): Transformer<Packet<any>>;
    private init;
}
