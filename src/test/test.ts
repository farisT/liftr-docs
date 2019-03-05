import { LiftrDocs } from '../../lib/core';
import { routes } from './routes';

import * as express from 'express';


const app = express();

const swaggerDescriptions :any = {
    info: {
      title: 'REST API Notifications',
      version: '1.0.0',
      description: 'This is the REST API for all the endpoints',
    },
    servers: [{
      url: `http://localhost:${process.env.PORT || 4000}`,
    }],
    openapi: '3.0.0',
    paths: {},
  };
  
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
        'application/json': {
          schema: {},
        },
      },
      description: '',
    },
  };

  app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));
