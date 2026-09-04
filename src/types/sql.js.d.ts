/**
 * sql.js ships no types. Only the surface the playground uses is declared —
 * a fuller definition would be guesswork about parts we never call.
 */
declare module "sql.js" {
  export type SqlValue = string | number | Uint8Array | null;

  export interface QueryResult {
    columns: string[];
    values: SqlValue[][];
  }

  export interface Database {
    exec(sql: string): QueryResult[];
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  export interface InitConfig {
    locateFile?: (file: string) => string;
  }

  export default function initSqlJs(config?: InitConfig): Promise<SqlJsStatic>;
}
