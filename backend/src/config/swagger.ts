/**
 * Swagger Configuration
 * OpenAPI/Swagger documentation setup
 */

import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import config from './index';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Learning Management System API',
            version: '1.0.0',
            description: 'API documentation for the Learning Management System',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}${config.apiPrefix}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
