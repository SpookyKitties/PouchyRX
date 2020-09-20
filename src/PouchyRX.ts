import PouchDB from 'pouchdb';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DBItem } from './DBItem';

export class PouchyRX<T extends DBItem> {
  public db: Observable<PouchDB.Database<T>>;

  public get = (_id: string) => {
    return this.db.pipe(
      map(
        async (db): Promise<T | undefined> => {
          try {
            return (await db.get(_id)) as T;
          } catch (error) {
            return undefined;
          }
        },
      ),
      mergeMap((o) => o),
    );
  };

  public rev = (_id: string) => {
    return this.get(_id).pipe(map((val) => (val ? val._id : undefined)));
  };

  public put = (doc: T, options?: PouchDB.Core.PutOptions) => {
    return forkJoin(this.rev(doc._id), this.db).pipe(
      map(async ([_rev, db]) => {
        try {
          doc._rev = _rev;
          return await db.put(doc, options);
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
