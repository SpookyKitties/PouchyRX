import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PouchyRX } from './PouchyRX';

export const mergeMap$ = mergeMap(
  <T>(o: T[] | Observable<T> | Promise<T>) => o,
);
const db = new PouchyRX('ppphf');

db.init().subscribe((o) => {
  console.log(o);
  // db.put({ _id: 'hjhg', tags: ['test2'] }).subscribe((p) => console.log(p));
  // db.get('hjhg').subscribe((o) => console.log(o));
  db.allDocs().subscribe((o) => console.log(o));
});
