import { Request, Response, NextFunction } from "express";
type TryCatchFunction = {
    (req: Request, res: Response, next: NextFunction):Promise<any>
}
const TryCatch =
  (fn:TryCatchFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default TryCatch;
