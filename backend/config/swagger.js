const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const getSwaggerOptions = (baseUrl = "http://localhost:5000") => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API Documentation",
      version: "1.0.0",
      description: "API documentation for EduNexa LMS",
    },
    servers: [
      {
        url: baseUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js", "./server.js"],
});

// function to setup swagger
const setupSwagger = (app) => {
  // Serve swagger UI static files first
  app.use("/api-docs", swaggerUi.serve);
  
  // Dynamic swagger spec setup
  app.get("/api-docs", (req, res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    const options = getSwaggerOptions(baseUrl);
    const swaggerSpec = swaggerJsdoc(options);
    
    swaggerUi.setup(swaggerSpec)(req, res, next);
  });
  
  // Also serve the spec as JSON with dynamic URL
  app.get("/api-docs/swagger.json", (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    const options = getSwaggerOptions(baseUrl);
    const swaggerSpec = swaggerJsdoc(options);
    
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(swaggerSpec);
  });
};

module.exports = { setupSwagger };
