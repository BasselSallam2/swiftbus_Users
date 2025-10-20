import { FingerprintResult } from "express-fingerprint";

declare module "express-serve-static-core" {
  interface Request {
    fingerprint?: FingerprintResult;
  }
}
