import { Packet, PacketTypeDefault } from "./Packet";
import { Transformer } from "./Transformer";

export class PacketTranformer implements Transformer<Packet> {
  static LENGTH_HEADER_SIZE = 4;
  static EVENT_HEADER_SIZE = 4;
  decode<T = any>(data: Buffer): Packet<T | string>[] {
    const result: Packet<T | string>[] = [];

    while (data.length > 0) {
      const packetLength = data.subarray(
        0,
        PacketTranformer.LENGTH_HEADER_SIZE
      );
      const packetEvent = data.subarray(
        PacketTranformer.LENGTH_HEADER_SIZE,
        PacketTranformer.LENGTH_HEADER_SIZE + PacketTranformer.EVENT_HEADER_SIZE
      );
      const bodyLength =
        packetLength.readUInt32BE(0) -
        PacketTranformer.LENGTH_HEADER_SIZE -
        PacketTranformer.EVENT_HEADER_SIZE;
      const headerLength =
        PacketTranformer.LENGTH_HEADER_SIZE +
        PacketTranformer.EVENT_HEADER_SIZE;
      const body = data.subarray(headerLength, headerLength + bodyLength);
      const type = packetEvent.readUInt32BE(0);

      const jsonParsedBody = JSON.parse(body.toString());

      const packet = new Packet(jsonParsedBody.data, type, jsonParsedBody.id);

      result.push(packet);
      data = data.subarray(headerLength + bodyLength);
    }

    return result;
  }

  encode(data: Packet): Buffer {
    const lengthHeader = Buffer.alloc(PacketTranformer.LENGTH_HEADER_SIZE);
    const eventHeader = Buffer.alloc(PacketTranformer.EVENT_HEADER_SIZE);
    const body = data.toBuffer();
    eventHeader.writeUInt32BE(
      typeof data.type === "number" ? data.type : PacketTypeDefault.Data,
      0
    );
    lengthHeader.writeUInt32BE(
      lengthHeader.length + eventHeader.length + body.length,
      0
    );
    return Buffer.concat([lengthHeader, eventHeader, body]);
  }
}
