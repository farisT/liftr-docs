import { Router } from 'express';

export interface AppRouter {
    path: string;
    middleware: any[];
    handler: Router;
};
