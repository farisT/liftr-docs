import * as express from 'express';
import { AppRouter } from './types/AppRouter.type';

import * as swaggerUi from 'swagger-ui-express';

/**
 * @param routes  The LiftrRoutingModule routes should be passed to here.
 * @param swaggerDescriptions  An object which defines the standard swagger info (e.g. url, version, title).
 * @param swaggerResponses  An object which defines the responses for each end point, add the structure related to Swagger here  (e.g. requestBody, responses, description).
 */

export function LiftrDocs (routes: AppRouter[], swaggerDescriptions: any, swaggerResponses: any)  {

    const endpointDefinitions = routes.map((route: AppRouter) => {
        const returnObject: any = {};
        // console.log(route.handler.stack)
        const preparedObject = route.handler.stack.map((depthRoute: any) =>  {
            const object = prepareObject(depthRoute);
            return object;
        })
        mergeLogic(preparedObject);
        // route.handler.stack.forEach(routeConfig => {
        //     // routeConfig.route.path checks what type of path
        //     // routeConfig.route.stack[0].method checks what type of endpoint
        //     const swaggerResponse = JSON.parse(JSON.stringify(swaggerResponses));
        //     // console.log('routeConfig', routeConfig.route.methods);
        //     const restMethod = routeConfig.route.methods;
        //     const pathName = `${routeConfig.route.path}`;
        //     console.log(pathName);
        //     Object.keys(restMethod).forEach(function(key) {
        //         let lol = {
        //             [key]:swaggerResponse
        //         }
        //         const newObj = Object.assign(returnObject.hello,lol);
        //         // if (!(key in returnObject)) {
        //         //     console.log('wow')
        //         //     returnObject[key] = returnObject[key];
        //         // }
        //     });
        //     // if(route.handler.stack.length >= 2) {
        //     //         returnObject[pathName] = { 
        //     //             get: swaggerResponse,
        //     //             post: swaggerResponse
        //     //     };
        //     // } 
        //     // else {
        //     //     if(routeConfig.route.stack[0].method === 'post') {
        //     //         returnObject[pathName] = { post: swaggerResponse };
        //     //     }
        //     //     if(routeConfig.route.stack[0].method === 'get'){
        //     //         returnObject[pathName] = { get: swaggerResponse };
        //     //     }
        //     // }
        // });
        // console.log('return', returnObject);
        return returnObject;
    });
  swaggerDescriptions.paths = endpointDefinitions.reduce((acc, cur) => Object.assign(acc, cur));
  const router = express.Router();
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDescriptions));

  return router;
};

const prepareObject = (data:any) => {
    const obj:any = {};
    const paths = data.route.path;
    const methods = data.route.methods;
    Object.keys(methods).forEach((key) => {
        let lol = {
            [paths]: {[key]:{}}
        }
        const newObj = Object.assign(obj,lol);
        return newObj;
    })
    return obj;
};


const mergeLogic = (preparedData:any) => {
    const goodStuff: any = [];
    // const reducer = (accumulateRoute:any,currentRoute:any, idx:any, src:any) => {
    //     console.log(currentRoute);
    //     console.log(Object.keys(currentRoute));
    //     console.log(idx);
    //     // console.log(src);
    //     accumulateRoute === currentRoute
    // }
    let init = 0;
    preparedData.forEach((routeObject:any, i:any) => {
        const key = Object.keys(routeObject);
        // asigning the first value to the finished array
        if(i === 0) {
            goodStuff.push(routeObject)
        };
        console.log('routeobject', routeObject)
        const finishedStuffKey = Object.keys(goodStuff[init])
        // if statement to check if value matches the last value of the finishing array
        console.log('finished', finishedStuffKey);
        const routeDirection = key[0]
        if(key[0] === finishedStuffKey[0]){
            console.log('match', finishedStuffKey)
            // if match push the value under the existing key in object within finished array
            // also add the index to let init;
            console.log('WOOOOW', Object.values(routeObject)[0])
            console.log('WAAAW', goodStuff[init][routeDirection])
            Object.assign(goodStuff[init][routeDirection], Object.values(routeObject)[0])
            console.log(goodStuff);
            init = i;
        }
        else {
            console.log('not match', finishedStuffKey)
        }
    })
}