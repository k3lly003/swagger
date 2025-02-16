import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../config";

let swaggerSpec: any;

// First try to load the pre-generated swagger.json file
const swaggerFilePath = path.resolve(__dirname, "../../swagger/swagger.json");

if (fs.existsSync(swaggerFilePath)) {
  try {
    // Load from the pre-generated file
    const swaggerJson = fs.readFileSync(swaggerFilePath, "utf8");
    swaggerSpec = JSON.parse(swaggerJson);
    console.log("Loaded Swagger spec from pre-generated file");
  } catch (error) {
    console.error("Error loading pre-generated Swagger file:", error);
    // Will fall back to generating dynamically
  }
}

// If the file doesn't exist or couldn't be parsed, generate it dynamically
if (!swaggerSpec) {
  console.log("Generating Swagger spec dynamically");

  // Define Swagger options
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Ganzafrica API",
      version: "1.0.0",
      description: "API documentation for Ganzafrica platform",
      license: {
        name: "Private",
      },
      contact: {
        name: "Ganzafrica Support",
        email: "support@ganzafrica.com",
      },
    },
    servers: [
      {
        url: env.NODE_ENV === "production"
            ? `https://backend-cbx8.onrender.com/api`
            : `${env.API_BASE_URL}:${env.API_PORT}/api`,
        description: env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "ganzafrica_auth",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: [
            "id",
            "email",
            "name",
            "base_role",
            "created_at",
            "updated_at",
          ],
          properties: {
            id: {
              type: "string",
              description: "User unique identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            base_role: {
              type: "string",
              enum: ["public", "applicant", "fellow", "employee", "alumni"],
              description: "User base role",
            },
            avatar_url: {
              type: "string",
              format: "uri",
              description: "User avatar URL",
            },
            email_verified: {
              type: "boolean",
              description: "Whether user email is verified",
            },
            is_active: {
              type: "boolean",
              description: "Whether user account is active",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Project: {
          type: "object",
          required: [
            "id",
            "name",
            "status",
            "start_date",
            "created_by",
            "created_at",
            "updated_at",
          ],
          properties: {
            id: {
              type: "string",
              description: "Project unique identifier",
            },
            name: {
              type: "string",
              description: "Project name",
            },
            description: {
              type: "string",
              description: "Project description",
            },
            status: {
              type: "string",
              enum: ["planned", "active", "completed"],
              description: "Project status",
            },
            start_date: {
              type: "string",
              format: "date-time",
              description: "Project start date",
            },
            end_date: {
              type: "string",
              format: "date-time",
              description: "Project end date",
            },
            created_by: {
              type: "string",
              description: "ID of user who created the project",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Error: {
          type: "object",
          required: ["error", "message"],
          properties: {
            error: {
              type: "string",
              description: "Error type",
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication information is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        BadRequestError: {
          description: "Invalid request parameters",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  };

  // Options for the swagger docs
  const options = {
    swaggerDefinition,
    // Paths to files with annotations
    apis: [
      path.resolve(__dirname, "../routes/*.ts"),
      path.resolve(__dirname, "../controllers/*.ts"),
    ],
  };

  // Initialize swagger-jsdoc
  swaggerSpec = swaggerJSDoc(options);
}

export default swaggerSpec;
