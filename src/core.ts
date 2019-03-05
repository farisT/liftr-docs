import * as express from 'express';
import { AppRouter } from './types/AppRouter.type';

import * as swaggerUi from 'swagger-ui-express';

/**
* @Method: LiftrDocs.
* @Param {array}
* @Param {any}
* @Param {any}
* @Return {Router}
*/

export const LiftrDocs = (routes: [], swaggerDescriptions: any, swaggerResponses: any) => {
    const endpointDefinitions = routes.map((route: AppRouter) => {
        const returnObject: any = {};
        route.handler.stack.forEach(routeConfig => {
            console.log('paths', routeConfig.route.path) //checks what type of path
            console.log('methods', routeConfig.route.stack[0].method) //checks what type of endpoint
            const swaggerResponse = JSON.parse(JSON.stringify(swaggerResponses));

            const pathName = `${routeConfig.route.path}`;
            if(routeConfig.route.stack[0].method === 'post') {
                returnObject[pathName] = { post: swaggerResponse };
            }
            if(routeConfig.route.stack[0].method === 'get'){
                returnObject[pathName] = { get: swaggerResponse };
            }
        });
        console.log(returnObject);
        return returnObject;
    });

    console.log(endpointDefinitions);

  swaggerDescriptions.paths = endpointDefinitions.reduce((acc, cur) => Object.assign(acc, cur));
  const router = express.Router();
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDescriptions));

  return router;
};

module.exports = LiftrDocs;
