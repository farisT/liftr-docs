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
        let returnObject: any = {};
        const parentRoute = route.path;
        const preparedObject = route.handler.stack.map((depthRoute: any) =>  {
            const object =  prepareObject(depthRoute,parentRoute,swaggerResponses);
            return object;
        })
        const mergedData = mergeLogic(preparedObject);
        // cleanup the final data with the final object
        mergedData.map((data:any) => {
            const paths = Object.keys(data)[0]
            const methods = Object.values(data)[0]
            Object.assign(returnObject, {[paths]:methods})
        })
        return returnObject;
    });

  swaggerDescriptions.paths = endpointDefinitions.reduce((acc, cur) => Object.assign(acc, cur));
  const router = express.Router();
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDescriptions));

  return router;
};

const prepareObject = (data:any, parentRoute:string, swaggerResponses:any) => {
    const obj:any = {};
    const paths = data.route.path;
    const methods = data.route.methods;
    const fullPath = parentRoute + paths;
    Object.keys(methods).forEach((key) => {
        let lol = {
            [fullPath]: {[key]:swaggerResponses}
        }
        const newObj = Object.assign(obj,lol);
        return newObj;
    })
    return obj;
};


const mergeLogic =  (preparedData:any) => {
    const goodStuff: any = [];
    preparedData.forEach( (routeObject:any, i:any) => {
        const key = Object.keys(routeObject);
        // asigning the first value to the finished array
        if(i === 0) {
            goodStuff.push(routeObject)
        };
        const routeDirection = key[0];
        checkIfExist(goodStuff,routeObject, routeDirection);
    })
    return goodStuff;
}

const checkIfExist = (routeArray:any, adderRoute:any, routeDirection:any) => {
    // loop through completing object and match any already known routes
    const actualLength = routeArray.length - 1;
    for (let index = 0; index < routeArray.length; index ++) {

        // if the object key from that index matches the adding route assign to the same 
        const method = Object.values(adderRoute)[0];
        const adderDirection = Object.keys(adderRoute)[0];

        // if match add it to the corresponding route
        if(Object.keys(routeArray[index])[0] === adderDirection) {
            Object.assign(routeArray[index][routeDirection], method)
            return
        }
        // if we reach the end of the array and still no matches, add it as a seperate route
        if(actualLength === index && Object.keys(routeArray[index])[0] !== adderDirection) {
            routeArray.push(adderRoute)
        }
    }
    return routeArray;
}
