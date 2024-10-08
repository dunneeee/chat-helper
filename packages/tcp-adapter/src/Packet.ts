import { Convertible } from "./Convertible";
import { PacketOutput } from "./PacketOutput";
import { TcpAdapter } from "./TcpAdapter";
import { TcpOutput } from "./TcpOutput";

export enum PacketTypeDefault {
  Error = 0,
  Data = 1,
}

export type PacketType = PacketTypeDefault | number;

export type PacketSerializable<T> = {
  type: PacketType;
  data: T;
  id: number;
};

export function isPacketSerializable<T>(
  obj: any
): obj is PacketSerializable<T> {
  return (
    typeof obj === "object" && obj !== null && "type" in obj && "data" in obj
  );
}

export class Packet<T = any> implements Convertible<PacketSerializable<T>> {
  type: PacketType;
  data: T;
  id: number;

  constructor(data: T, type: PacketType, id: number);
  constructor(data: T, type: PacketType);
  constructor(id: number, data: T);
  constructor(data: T);
  constructor(dataOrId: T | number, typeOrData?: PacketType, id?: number) {
    if (typeof dataOrId === "number") {
      this.id = dataOrId;
      this.data = typeOrData as T;
      this.type = PacketTypeDefault.Data;
    } else if (arguments.length === 1) {
      this.data = dataOrId as T;
      this.type = PacketTypeDefault.Data;
      this.id = -1;
    } else if (arguments.length === 2 && typeof typeOrData === "number") {
      this.data = dataOrId as T;
      this.type = typeOrData;
      this.id = -1;
    } else {
      this.data = dataOrId as T;
      this.type = typeOrData as PacketType;
      this.id = id as number;
    }
  }

  toBuffer(): Buffer {
    return Buffer.from(
      JSON.stringify({
        id: this.id,
        data: this.data,
      })
    );
  }

  toPlainObject(): PacketSerializable<T> {
    return {
      type: this.type,
      data: this.data,
      id: this.id,
    };
  }

  newOutput(adapter: TcpAdapter) {
    return new PacketOutput(this, adapter);
  }
}
