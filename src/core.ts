import * as express from 'express';
import { AppRouter } from './types/AppRouter.type';

import * as swaggerUi from 'swagger-ui-express';

/**
 * @param routes  The AppRoutingModule should be passed to here.
 * @param swaggerDescriptions  An object which defines the standard swagger info (e.g. url, version, title).
 * @param swaggerResponses  An object which defines the responses for each end point, add the structure related to Swagger here  (e.g. requestBody, responses, description).
 */

export function LiftrDocs (routes: AppRouter[], swaggerDescriptions: any, swaggerResponses: any)  {
    const endpointDefinitions = routes.map((route: AppRouter) => {
        const returnObject: any = {};
        route.handler.stack.forEach(routeConfig => {
            // routeConfig.route.path checks what type of path
            // routeConfig.route.stack[0].method checks what type of endpoint
            const swaggerResponse = JSON.parse(JSON.stringify(swaggerResponses));

            const pathName = `${routeConfig.route.path}`;
            if(routeConfig.route.stack[0].method === 'post') {
                returnObject[pathName] = { post: swaggerResponse };
            }
            if(routeConfig.route.stack[0].method === 'get'){
                returnObject[pathName] = { get: swaggerResponse };
            }
        });
        return returnObject;
    });

  swaggerDescriptions.paths = endpointDefinitions.reduce((acc, cur) => Object.assign(acc, cur));
  const router = express.Router();
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDescriptions));

  return router;
};
