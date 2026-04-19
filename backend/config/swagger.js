const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// 🔥 Generate Swagger options dynamically
const getSwaggerOptions = (baseUrl) => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduNexa LMS API",
      version: "1.0.0",
      description: "API documentation for EduNexa LMS",
    },
    servers: [
      {
        url: baseUrl, // ✅ Dynamic URL (auto detects Render / localhost)
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server",
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
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./server.js"],
});

// 🚀 Setup Swagger
const setupSwagger = (app) => {
  // Serve static files
  app.use("/api-docs", swaggerUi.serve);

  // Swagger UI route
  app.get("/api-docs", (req, res, next) => {
    try {
      const protocol =
        req.headers["x-forwarded-proto"] || req.protocol;

      const host =
        req.headers["x-forwarded-host"] || req.headers.host;

      const baseUrl = `${protocol}://${host}`;

      const swaggerSpec = swaggerJsdoc(
        getSwaggerOptions(baseUrl)
      );

      swaggerUi.setup(swaggerSpec, {
        explorer: true,
      })(req, res, next);
    } catch (err) {
      console.error("Swagger UI Error:", err);
      res.status(500).json({ message: "Swagger failed to load" });
    }
  });

  // Swagger JSON endpoint
  app.get("/api-docs/swagger.json", (req, res) => {
    try {
      const protocol =
        req.headers["x-forwarded-proto"] || req.protocol;

      const host =
        req.headers["x-forwarded-host"] || req.headers.host;

      const baseUrl = `${protocol}://${host}`;

      const swaggerSpec = swaggerJsdoc(
        getSwaggerOptions(baseUrl)
      );

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");

      res.send(swaggerSpec);
    } catch (err) {
      console.error("Swagger JSON Error:", err);
      res.status(500).json({ message: "Swagger JSON failed" });
    }
  });
};

module.exports = { setupSwagger };