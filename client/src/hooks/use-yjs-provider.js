import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { Doc } from "yjs";

/**
 * @param {Doc} doc 
 * @returns {{provider: HocuspocusProvider|null, status: string, synced: boolean}}
 */
function useYjsProvider(doc) {
  /** @type {[HocuspocusProvider|null, Function]} */
  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const newProvider = new HocuspocusProvider({
      url: "ws://localhost:9876",
      name: "editor-da-galera",
      document: doc,
      onConnect: () => {
        setStatus("connected");
      },
      onDisconnect: () => {
        setStatus("disconnected");
      },
      onSynced: (isSynced) => {
        setSynced(isSynced.state);
      },
    });

    setProvider(newProvider);

    return () => {
      newProvider.destroy();
    };
  }, [doc]);

  return { provider, status, synced };
}

export default useYjsProvider;
