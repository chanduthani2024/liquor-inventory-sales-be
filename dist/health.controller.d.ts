import { Request } from 'express';
export declare class HealthController {
    check(request: Request): {
        status: string;
        message: string;
        timestamp: string;
        cors: string;
        headers: {
            origin: string;
            host: string;
            userAgent: string;
            referer: string;
        };
    };
}
