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
        const parentRoute = route.path;
        const preparedObject = route.handler.stack.map((depthRoute: any) =>  {
            const object =  prepareObject(depthRoute,parentRoute);
            return object;
        })
        const mergedData = mergeLogic(preparedObject);
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

const prepareObject = (data:any, parentRoute:string) => {
    const obj:any = {};
    const paths = data.route.path;
    const methods = data.route.methods;
    const fullPath = parentRoute + paths;
    Object.keys(methods).forEach((key) => {
        let lol = {
            [fullPath]: {[key]:{}}
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
        // console.log('routeobject', routeObject)
        // console.log(init);
        const routeDirection = key[0];
        checkIfExist(goodStuff,routeObject, routeDirection);
        // console.log(match);
        // console.log(match);
        // if(match) {
        //     const addingRoute = Object.values(routeObject)[0];
        //     Object.assign(goodStuff[init][routeDirection], addingRoute)
        // } else {
        //    goodStuff.push(routeObject)
        // }
        // const finishedStuffKey = Object.keys(goodStuff[init])
        // if statement to check if value matches the last value of the finishing array
        // console.log('finished', finishedStuffKey);
        // if(routeDirection === finishedStuffKey[0]){
        //     console.log('match', finishedStuffKey)
        //     // console.log('YES', routeDirection)
        //     // if match push the value under the existing key in object within finished array
        //     // also add the index to let init;
        //     const addingRoute = Object.values(routeObject)[0];
        //     // console.log('WAAAW', goodStuff[init][routeDirection])
        //     Object.assign(goodStuff[init][routeDirection], addingRoute)
        //     // console.log('GOOD', goodStuff);
        // }
        // else {
        //     console.log('not match', finishedStuffKey)
        //     // console.log('NO', routeDirection)
        //     goodStuff.push(routeObject)
        //     // init = i;
        // }
    })
    // preparedData.reduce( (accumulator:any, route:any) => {
    //     // console.log('accumulator', accumulator)
    //     // console.log('user', route)
    //     console.log('ACCUMU', accumulator);
    //     accumulator.forEach((element:any, i:any) => {
    //         const routeDirection = Object.keys(element)[0];
    //         const method =Object.values(element)[0];
    //         if(Object.keys(element)[0] === Object.keys(accumulator[i])[0]){
    //             Object.assign(accumulator[i][routeDirection], method)
    //             console.log('match', accumulator);            }
    //     });
    //     if(Object.keys(accumulator)[0] === Object.keys(route)[0]){        }
    //     else {
    //         accumulator.push(route)
    //     }
    //     return accumulator;
    // }, [])
    console.log('HEYYYY',JSON.stringify(goodStuff,null,2));
    // let array = [{'/hehe':{}}, {'/':{}},{'/':{}}]
    //    const thisIt =  array.reduce((acc:any,route:any) => {
    //         const nice = Object.keys(route)[0];
    //         acc.push(nice);
    //         return acc;
    //     },[])
    //     console.log(thisIt);
        // if thisIt.indexOf('/')

    return goodStuff;
}

const checkIfExist = (routeArray:any, adderRoute:any, routeDirection:any) => {
    // loop through completing object and match any already known routes
    const actualLength = routeArray.length - 1;
    for (let index = 0; index < routeArray.length; index ++) {

        // if the object key from that index matches the adding route assign to the same 
        const method = Object.values(adderRoute)[0];
        const adderDirection = Object.keys(adderRoute)[0];
        if(Object.keys(routeArray[index])[0] === adderDirection) {
            console.log('match', Object.keys(routeArray[index])[0],'this one', adderDirection)
            // console.log(adderRoute);
            Object.assign(routeArray[index][routeDirection], method)
            return
        }
        if(actualLength === index && Object.keys(routeArray[index])[0] !== adderDirection) {
            console.log('not Matching', adderDirection, 'THIS ONE', Object.keys(routeArray[index])[0])
            routeArray.push(adderRoute)
        }
    }
    return routeArray;
}
