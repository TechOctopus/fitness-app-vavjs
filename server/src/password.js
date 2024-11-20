import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

// I take and modify this code from https://stackoverflow.com/a/67038052
export function hash(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = scryptSync(password, salt, 32);
  return `${buf.toString("hex")}.${salt}`;
}

export function verify(password, hash) {
  const [hashedPassword, salt] = hash.split(".");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = scryptSync(password, salt, 32);
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
// -----------------------------------------------
