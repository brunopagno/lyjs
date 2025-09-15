/*
 * this file is an adaptation of the default extension-sqlite package offered by hocuspocus
 *
 * https://github.com/ueberdosis/hocuspocus/blob/main/packages/extension-sqlite/src/SQLite.ts
 *
 * Here we persist not only the blob data, but it's "string" representation and the doc json
 *
 */

import { Database } from "@hocuspocus/extension-database";
import sqlite3 from "sqlite3";
import { fromUint8Array } from "js-base64";

export const schema = `CREATE TABLE IF NOT EXISTS "documents" (
  "name" varchar(255) NOT NULL,
  "data" blob NOT NULL,
  "raw" text NOT NULL,
  "doc" text NOT NULL,
  UNIQUE(name)
)`;

export const selectQuery = `
  SELECT data FROM "documents" WHERE name = $name ORDER BY rowid DESC
`;

export const upsertQuery = `
  INSERT INTO "documents" ("name", "data", "raw", "doc") VALUES ($name, $data, $raw, $doc)
    ON CONFLICT(name) DO UPDATE SET data = $data, raw = $raw, doc = $doc
`;

const SQLITE_INMEMORY = ":memory:";

export class SQLite extends Database {
  configuration = {
    database: SQLITE_INMEMORY,
    schema,
    fetch: async ({ documentName }) => {
      return new Promise((resolve, reject) => {
        this.db?.get(
          selectQuery,
          {
            $name: documentName,
          },
          (error, row) => {
            if (error) {
              reject(error);
            }

            resolve(row?.data);
          },
        );
      });
    },
    store: async ({ documentName, document, state }) => {
      const rawState = fromUint8Array(state);
      const doc = document.getXmlFragment("blocknote").toString();
      this.db?.run(upsertQuery, {
        $name: documentName,
        $data: state,
        $raw: rawState,
        $doc: doc,
      });
    },
  };

  constructor(configuration) {
    super({});

    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  }

  async onConfigure() {
    this.db = new sqlite3.Database(this.configuration.database);
    this.db.run(this.configuration.schema);
  }

  async onListen() {
    if (this.configuration.database === SQLITE_INMEMORY) {
      console.warn(
        `  ${"The SQLite extension is configured as an in-memory database. All changes will be lost on restart!"}`,
      );
      console.log();
    }
  }
}
