// express.d.ts ya @types/express/index.d.ts
import { JWTUserPayload } from './path-to-your-interface-file';

declare global {
  namespace Express {
    interface Request {
      user?: JWTUserPayload;
    }
  }
}

export {};
