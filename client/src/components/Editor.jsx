import { BlockNoteView } from "@blocknote/ariakit";
import "@blocknote/ariakit/style.css";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useMemo } from "react";
import * as Y from "yjs";
import useYjsProvider from "../hooks/use-yjs-provider.js";
import { getRandomColour, getRandomName } from "../services/random.js";

function Editor() {
  const doc = useMemo(() => new Y.Doc(), []);
  const { provider, status, synced } = useYjsProvider(doc);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("blocknote"),
      user: {
        name: getRandomName(),
        color: getRandomColour(),
      },
      showCursorLabels: "always",
    },
  });

  if (!provider || !editor) {
    return <div>Loading collaboration provider... [status:{status}]</div>;
  }

  return (
    <>
      <div>Connection status: {status} {synced ? "(synced)" : ""}</div>
      <BlockNoteView editor={editor} />
    </>
  );
}

export default Editor;
