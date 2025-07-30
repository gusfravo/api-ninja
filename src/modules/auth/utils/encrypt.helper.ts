import { from, Observable, switchMap } from 'rxjs';
import { genSalt, hash, compare } from 'bcrypt';

/**
 * Helper to encrypt password
 */
export function encryptPassword(password: string): Observable<string> {
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  return from(genSalt(10)).pipe(
    switchMap((salt) => {
      return from(hash(password, salt));
    }),
  );
}

/**
 * Helper to match password
 */
export function matchPassword(
  password: string,
  savedPassword: string,
): Observable<boolean> {
  return from(compare(password, savedPassword));
}
