import { Router } from 'express';
import { LiftrRoute } from './liftr.route'

export interface AppRouter {
  path: string;
  middleware: any[];
  handler: Router;
}

export const routes: AppRouter[] = [
  {
    handler: LiftrRoute,
    middleware: [],
    path: '/liftr',
  },
];
