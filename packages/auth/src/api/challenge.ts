/**
 * Challenge object for reply attack prevention.
 */
export interface Challenge {
  /**
   * The challenge identifier. This is the challenge to solve.
   */
  id: string;

  /**
   * The challenge purpose.
   */
  purpose: string;

  /**
   * The challenge expiration time.
   */
  expires: number;
}
