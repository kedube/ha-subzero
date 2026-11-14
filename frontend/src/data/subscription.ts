import type { HassConnection } from "../hass";
import type { PanelMessage } from "../types";

type Unsubscribe = () => Promise<void>;

/** One call to subscribe, with its unsubscribe once the server has answered. */
interface Attempt {
  unsubscribe?: Unsubscribe;
}

/** The socket may already be closed, which rejects the unsubscribe; nothing to do then. */
function end(unsubscribe: Unsubscribe): void {
  void Promise.resolve()
    .then(unsubscribe)
    .catch(() => {});
}

/**
 * The panel's `subzero/panel/subscribe` subscription: one per connection object. A new
 * connection (Home Assistant hands a new one after some reconnects) gets a fresh subscription,
 * and messages from a connection that has been replaced or disconnected are ignored.
 *
 * When the socket reconnects, it subscribes again itself instead of leaving that to
 * home-assistant-js-websocket. Left to the library, a subscription made while the socket is down
 * doesn't settle until the replay, and a replay the server rejects (the integration still loading
 * after a restart, say) is reported to no one. Here every failure reaches `onError`.
 */
export class PanelSubscription {
  private connection: HassConnection | undefined;
  /** The subscription whose messages count; undefined while there's none to speak of. */
  private current: Attempt | undefined;
  private stopListening: (() => void) | undefined;

  constructor(
    private readonly onMessage: (message: PanelMessage) => void,
    private readonly onError: (error: unknown) => void,
  ) {}

  /** Subscribes on `connection` unless already subscribed there; undefined unsubscribes. */
  connect(connection: HassConnection | undefined): void {
    if (connection === this.connection) return;
    this.disconnect();
    if (!connection) return;
    this.connection = connection;
    // A lost socket takes its subscriptions with it, so the unsubscribe is dropped unused: it
    // names a command by a number the next socket may give to something else.
    const onDisconnected = () => {
      this.current = undefined;
    };
    const onReady = () => this.subscribe(connection);
    connection.addEventListener("disconnected", onDisconnected);
    connection.addEventListener("ready", onReady);
    this.stopListening = () => {
      connection.removeEventListener("disconnected", onDisconnected);
      connection.removeEventListener("ready", onReady);
    };
    this.subscribe(connection);
  }

  private subscribe(connection: HassConnection): void {
    const attempt: Attempt = {};
    this.current = attempt;
    let subscription: Promise<Unsubscribe>;
    try {
      subscription = connection.subscribeMessage<PanelMessage>(
        (message) => {
          if (this.current === attempt) this.onMessage(message);
        },
        { type: "subzero/panel/subscribe" },
        { resubscribe: false },
      );
    } catch (error) {
      subscription = Promise.reject(error);
    }
    subscription.then(
      (unsubscribe) => {
        if (this.current === attempt) attempt.unsubscribe = unsubscribe;
        // The panel moved on before the server answered. An answer only comes over a live
        // socket, where this would be a second subscription.
        else end(unsubscribe);
      },
      (error: unknown) => {
        if (this.current === attempt) this.onError(error);
      },
    );
  }

  disconnect(): void {
    const attempt = this.current;
    this.stopListening?.();
    this.stopListening = undefined;
    this.connection = undefined;
    this.current = undefined;
    // One that hasn't been answered yet ends when it is (see subscribe).
    if (attempt?.unsubscribe) end(attempt.unsubscribe);
  }

  /** Subscribes again on the same connection, after an error. */
  retry(): void {
    const connection = this.connection;
    this.disconnect();
    this.connect(connection);
  }
}
