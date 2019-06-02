# liftr-docs

[![npmversion](https://img.shields.io/npm/v/@liftr/docs.svg)](https://github.com/farisT/liftr-docs)

A middleware for documenting your [Liftr](https://github.com/farisT/liftr) routes with [Swagger 3.0](https://swagger.io/) under the hood.

## Installation

```
npm install @liftr/docs --save
```


## Example usage

```
import * as express from 'express';
import { LiftrDocs } from '@liftr/docs';
import { routes } from '@routes/LiftrRoutingModule';

// swaggerDescriptions
// ---------------------------
// standard info and port config for the documentation
// the version of openapi used is 3.0.0. THIS SHOULD NOT CHANGE.

const swaggerDescriptions = {
  info: {
    title: 'Liftr REST API',
    version: '1.0.0',
    description: 'REST API for all the endpoints',
  },
  servers: [{
    url: `http://localhost:${process.env.PORT || 4000}`,
  }],
  openapi: '3.0.0', 
  paths: {},
};

// swaggerResponses
// ---------------------------
// Define the responses for your API endpoints and what type of request body you will send. 

const swaggerResponses = {
  responses: {
    200: {
      description: 'OK',
    },
    400: {
      description: 'Error: Bad Request',
    },
    401: {
      description: 'Error: Unauthorized',
    },
  },
  requestBody: {
    required: true,
    content: {
      'application/json': { },
    },
    description: '',
  },
};

// This will initiate the /docs route to contain the swagger documentation
// This will use the routes created in the LiftrRoutingModule
app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));

```