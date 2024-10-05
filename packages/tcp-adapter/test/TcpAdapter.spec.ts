import { Packet } from "../src/Packet";
import { TcpAdapter } from "./../src/TcpAdapter";
import { Socket } from "net";

describe("TcpAdapter", () => {
  let socket: Socket;
  let adapter: TcpAdapter;

  beforeEach(() => {
    socket = new Socket();
    adapter = new TcpAdapter(socket);
  });

  test('should emit "packet" event', (done) => {
    const sendPacket = new Packet("Hello world", 3);

    adapter.on("packet", (packet) => {
      expect(packet).toBeInstanceOf(Packet);
      expect(packet.id).toBe(sendPacket.id);
      expect(packet.data).toBe(sendPacket.data);
      done();
    });

    socket.emit("data", adapter.getPacketTranformer().encode(sendPacket));
  });

  test("should emit packet_out_resolving event", (done) => {
    const sendPacket = new Packet("Hello world", 1);
    sendPacket.id = -1;

    adapter.on("packet_out_resolving", (packet) => {
      expect(packet).toBeInstanceOf(Packet);
      expect(packet.id).toBe(sendPacket.id);
      expect(packet.data).toBe(sendPacket.data);
      done();
    });

    socket.emit("data", adapter.getPacketTranformer().encode(sendPacket));
  });

  afterEach(() => {
    socket.destroy();
  });
});
