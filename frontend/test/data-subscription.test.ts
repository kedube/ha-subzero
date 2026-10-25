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
    const connection = {
      subscribeMessage: () => {
        throw new Error("closed");
      },
    } as unknown as HassConnection;
    subscription.connect(connection);
    await flush();
    expect(onError).toHaveBeenCalledWith(new Error("closed"));
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
