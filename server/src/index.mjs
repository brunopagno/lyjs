import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";
import { SQLite } from "./SQLite.mjs";

const server = new Server({
  port: 9876,
  extensions: [
    new Logger(),
    new SQLite({ database: "data/db.sqlite" }),
  ],
});

server.listen();
