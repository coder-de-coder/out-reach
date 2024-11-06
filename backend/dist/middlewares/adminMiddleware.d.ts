import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: {
        email: string;
        userId: number;
        role: string;
        permissions: any[];
        resources: any[];
    };
}
declare const adminMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response | void;
export default adminMiddleware;
