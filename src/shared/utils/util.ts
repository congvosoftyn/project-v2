import { Request, Response } from 'express';

export const toAbsoluteUrl = (req: Request, url: string) => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}${url}`;
}