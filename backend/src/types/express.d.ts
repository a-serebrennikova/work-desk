import { User } from './index';

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}