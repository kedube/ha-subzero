import { describe, expect, it, vi } from "vitest";
import { PanelSubscription } from "../src/data/subscription";
import type { HassConnection } from "../src/hass";
import type { PanelMessage } from "../src/types";
import { SPECS, flush, makeAppliance, makeConnection } from "./shell-fixtures";

const MESSAGE: PanelMessage = { appliances: [makeAppliance("fridge", SPECS.sideBySide)] };

function setup() {
  const onMessage = vi.fn();
  const onError = vi.fn();
  return { onMessage, onError, subscription: new PanelSubscription(onMessage, onError) };
}

describe("PanelSubscription", () => {
  it("subscribes once per connection object", async () => {
    const { onMessage, subscription } = setup();
    const connection = makeConnection();
    subscription.connect(connection as unknown as HassConnection);
    subscription.connect(connection as unknown as HassConnection);
    expect(connection.subscribeMessage).toHaveBeenCalledOnce();
    expect(connection.subscribeMessage.mock.calls[0][1]).toEqual({ type: "subzero/panel/subscribe" });
    // It subscribes again itself after a reconnect, so the library mustn't too.
    expect(connection.subscribeMessage.mock.calls[0][2]).toEqual({ resubscribe: false });
    await flush();
    connection.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledWith(MESSAGE);
  });

  it("moves to a new connection, unsubscribing the old one and ignoring it", async () => {
    const { onMessage, subscription } = setup();
    const first = makeConnection();
    const second = makeConnection();
    subscription.connect(first as unknown as HassConnection);
    await flush();
    subscription.connect(second as unknown as HassConnection);
    await flush();
    expect(first.unsubscribe).toHaveBeenCalledOnce();
    expect(second.subscribeMessage).toHaveBeenCalledOnce();
    first.send(MESSAGE);
    expect(onMessage).not.toHaveBeenCalled();
    second.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledOnce();
  });

  it("unsubscribes on disconnect, even before the subscription has settled", async () => {
    const { onMessage, subscription } = setup();
    const connection = makeConnection();
    subscription.connect(connection as unknown as HassConnection);
    subscription.disconnect();
    await flush();
    expect(connection.unsubscribe).toHaveBeenCalledOnce();
    connection.send(MESSAGE);
    expect(onMessage).not.toHaveBeenCalled();
  });

  it("reports a failed subscription, and subscribes again on retry", async () => {
    const { onError, onMessage, subscription } = setup();
    const connection = makeConnection();
    connection.subscribeMessage.mockRejectedValueOnce({ code: "unknown_command", message: "Unknown command." });
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    expect(onError).toHaveBeenCalledWith({ code: "unknown_command", message: "Unknown command." });
    subscription.retry();
    await flush();
    expect(connection.subscribeMessage).toHaveBeenCalledTimes(2);
    connection.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledOnce();
  });

  it("reports a subscribe call that throws", async () => {
    const { onError, subscription } = setup();
    const connection = makeConnection();
    connection.subscribeMessage.mockImplementationOnce(() => {
      throw new Error("closed");
    });
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    expect(onError).toHaveBeenCalledWith(new Error("closed"));
  });

  it("subscribes again when the socket reconnects, leaving the lost socket's subscription alone", async () => {
    const { onMessage, subscription } = setup();
    const connection = makeConnection();
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    connection.fire("disconnected");
    connection.fire("ready");
    await flush();
    expect(connection.subscribeMessage).toHaveBeenCalledTimes(2);
    // The old unsubscribe names a command of the old socket, which the new one may have given away.
    expect(connection.unsubscribe).not.toHaveBeenCalled();
    connection.send(MESSAGE, 0);
    expect(onMessage).not.toHaveBeenCalled();
    connection.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledOnce();
    subscription.disconnect();
    await flush();
    expect(connection.unsubscribe).toHaveBeenCalledOnce();
  });

  it("reports a subscription the server rejects after a reconnect", async () => {
    // The integration is still loading after a restart, say.
    const { onError, subscription } = setup();
    const connection = makeConnection();
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    connection.subscribeMessage.mockRejectedValueOnce({ code: "unknown_command", message: "Unknown command." });
    connection.fire("disconnected");
    connection.fire("ready");
    await flush();
    expect(onError).toHaveBeenCalledWith({ code: "unknown_command", message: "Unknown command." });
  });

  it("subscribes once the socket is back when it was down at first", async () => {
    // The library leaves a subscription made while the socket is closed unsettled.
    const { onError, onMessage, subscription } = setup();
    const connection = makeConnection();
    connection.subscribeMessage.mockReturnValueOnce(new Promise(() => {}));
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    connection.fire("ready");
    await flush();
    expect(connection.subscribeMessage).toHaveBeenCalledTimes(2);
    connection.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
  });

  it("ends a subscription that's answered only after it has subscribed again", async () => {
    // One the library held back until the socket was ready goes out next to the new one.
    const { onMessage, subscription } = setup();
    const connection = makeConnection();
    let answer!: (unsubscribe: () => Promise<void>) => void;
    const held = vi.fn(async () => {});
    connection.subscribeMessage.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
    subscription.connect(connection as unknown as HassConnection);
    connection.fire("ready");
    await flush();
    answer(held);
    await flush();
    expect(held).toHaveBeenCalledOnce();
    expect(connection.unsubscribe).not.toHaveBeenCalled();
    connection.send(MESSAGE);
    expect(onMessage).toHaveBeenCalledOnce();
  });

  it("doesn't unsubscribe while the socket is down, and stops listening once it has left", async () => {
    const { subscription } = setup();
    const connection = makeConnection();
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    connection.fire("disconnected");
    subscription.disconnect();
    await flush();
    expect(connection.unsubscribe).not.toHaveBeenCalled();
    connection.fire("ready");
    await flush();
    expect(connection.subscribeMessage).toHaveBeenCalledOnce();
  });

  it("swallows a rejected unsubscribe from a closed socket", async () => {
    const { subscription } = setup();
    const connection = makeConnection();
    connection.unsubscribe.mockRejectedValueOnce(new Error("Connection lost"));
    subscription.connect(connection as unknown as HassConnection);
    await flush();
    subscription.disconnect();
    await flush();
    expect(connection.unsubscribe).toHaveBeenCalledOnce();
  });

  it("doesn't report an error from a connection it has left", async () => {
    const { onError, subscription } = setup();
    const connection = makeConnection();
    let fail!: (error: unknown) => void;
    connection.subscribeMessage.mockReturnValueOnce(new Promise((_, reject) => (fail = reject)));
    subscription.connect(connection as unknown as HassConnection);
    subscription.disconnect();
    fail(new Error("late"));
    await flush();
    expect(onError).not.toHaveBeenCalled();
  });
});
