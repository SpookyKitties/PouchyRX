import PouchDB from 'pouchdb';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DBItem } from './DBItem';

export class PouchyRX<T extends DBItem> {
  public db: Observable<PouchDB.Database<T>>;

  public get = (_id: string) => {
    return this.db.pipe(
      map(async (db) => {
        try {
          return (await db.get(_id)) as T;
        } catch (error) {
          return undefined;
        }
      }),
      mergeMap((o) => o),
    );
  };

  constructor(
    dbName: string,
    options?:
      | PouchDB.Configuration.DatabaseConfiguration
      | PouchDB.Configuration.CommonDatabaseConfiguration
      | PouchDB.Configuration.LocalDatabaseConfiguration
      | PouchDB.Configuration.RemoteDatabaseConfiguration,
  ) {
    this.db = of(new PouchDB(dbName, options));
  }
}
