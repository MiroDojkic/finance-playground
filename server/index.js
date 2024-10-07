import Fastify from 'fastify';
import cors from '@fastify/cors';
import { search, fetchCovarianceMatrix, fetchMeanReturns } from './finance.js';

const port = process.env.PORT || 3000;
const server = Fastify({ logger: true });
await server.register(cors);

const searchEndpointConfig = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        search: { type: 'string' }
      },
      required: ['search']
    }
  }
}

const analysisEndpointConfig = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        assets: { type: 'array', items: { type: 'string' } },
        startDate: { type: 'string', format: 'date' }
      },
      required: ['assets', 'startDate']
    }
  }
}

server.get('/assets', searchEndpointConfig, async (request) => {
  return { data: await search(request.query.search) };
});

server.get('/covariance-matrix', analysisEndpointConfig, async (request) => {
  const { assets, startDate } = request.query;
  return { data: await fetchCovarianceMatrix(assets, startDate) };
});

server.get('/mean-returns', analysisEndpointConfig, async (request) => {
  const { assets, startDate } = request.query;
  return { data: await fetchMeanReturns(assets, startDate) };
});

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening on ${address}`);
});
