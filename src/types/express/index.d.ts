import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      // add other fields if needed
    };
  }
}