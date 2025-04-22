// Mock API service for workers
// In a real application, this would fetch data from your backend

export async function fetchWorkers() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: "worker-1",
      name: "CSV Data Extractor",
      description: "Extracts data from CSV files and converts it to structured format",
      type: "data",
      executionTime: "~2s",
      inputs: [
        {
          name: "filePath",
          type: "string",
          description: "Path to the CSV file",
          required: true,
        },
        {
          name: "delimiter",
          type: "string",
          description: "CSV delimiter character",
          defaultValue: ",",
          required: false,
        },
        {
          name: "hasHeader",
          type: "boolean",
          description: "Whether the CSV has a header row",
          defaultValue: true,
          required: false,
        },
      ],
      outputs: [
        {
          name: "data",
          type: "array",
          description: "Extracted data as array of objects",
        },
        {
          name: "rowCount",
          type: "number",
          description: "Number of rows processed",
        },
      ],
    },
    {
      id: "worker-2",
      name: "Database Query",
      description: "Executes SQL queries against a database and returns results",
      type: "data",
      executionTime: "~3s",
      inputs: [
        {
          name: "connectionString",
          type: "string",
          description: "Database connection string",
          required: true,
        },
        {
          name: "query",
          type: "string",
          description: "SQL query to execute",
          required: true,
        },
        {
          name: "parameters",
          type: "object",
          description: "Query parameters",
          required: false,
        },
      ],
      outputs: [
        {
          name: "results",
          type: "array",
          description: "Query results",
        },
        {
          name: "affectedRows",
          type: "number",
          description: "Number of affected rows for write operations",
        },
      ],
    },
    {
      id: "worker-3",
      name: "Data Transformer",
      description: "Transforms data structure from one format to another",
      type: "process",
      executionTime: "~1s",
      inputs: [
        {
          name: "data",
          type: "any",
          description: "Input data to transform",
          required: true,
        },
        {
          name: "transformationRules",
          type: "object",
          description: "Rules for transformation",
          required: true,
        },
      ],
      outputs: [
        {
          name: "transformedData",
          type: "any",
          description: "Transformed data",
        },
      ],
    },
    {
      id: "worker-4",
      name: "Email Sender",
      description: "Sends emails with customizable templates and attachments",
      type: "api",
      executionTime: "~2s",
      inputs: [
        {
          name: "to",
          type: "string",
          description: "Recipient email address",
          required: true,
        },
        {
          name: "subject",
          type: "string",
          description: "Email subject",
          required: true,
        },
        {
          name: "body",
          type: "string",
          description: "Email body content (supports HTML)",
          required: true,
        },
        {
          name: "attachments",
          type: "array",
          description: "List of file attachments",
          required: false,
        },
      ],
      outputs: [
        {
          name: "success",
          type: "boolean",
          description: "Whether the email was sent successfully",
        },
        {
          name: "messageId",
          type: "string",
          description: "ID of the sent message",
        },
      ],
    },
    {
      id: "worker-5",
      name: "HTTP Request",
      description: "Makes HTTP requests to external APIs and services",
      type: "api",
      executionTime: "~2s",
      inputs: [
        {
          name: "url",
          type: "string",
          description: "URL to make the request to",
          required: true,
        },
        {
          name: "method",
          type: "string",
          description: "HTTP method (GET, POST, PUT, DELETE)",
          defaultValue: "GET",
          required: false,
        },
        {
          name: "headers",
          type: "object",
          description: "HTTP headers",
          required: false,
        },
        {
          name: "body",
          type: "any",
          description: "Request body for POST/PUT requests",
          required: false,
        },
      ],
      outputs: [
        {
          name: "statusCode",
          type: "number",
          description: "HTTP status code",
        },
        {
          name: "response",
          type: "any",
          description: "Response data",
        },
        {
          name: "headers",
          type: "object",
          description: "Response headers",
        },
      ],
    },
    {
      id: "worker-6",
      name: "File System Operations",
      description: "Performs file system operations like read, write, copy, move",
      type: "system",
      executionTime: "~1s",
      inputs: [
        {
          name: "operation",
          type: "string",
          description: "Operation type (read, write, copy, move, delete)",
          required: true,
        },
        {
          name: "sourcePath",
          type: "string",
          description: "Source file/directory path",
          required: true,
        },
        {
          name: "destinationPath",
          type: "string",
          description: "Destination path for copy/move operations",
          required: false,
        },
        {
          name: "content",
          type: "string",
          description: "Content to write for write operations",
          required: false,
        },
      ],
      outputs: [
        {
          name: "success",
          type: "boolean",
          description: "Whether the operation was successful",
        },
        {
          name: "data",
          type: "any",
          description: "Data read (for read operations)",
        },
      ],
    },
    {
      id: "worker-7",
      name: "Data Validator",
      description: "Validates data against a schema or set of rules",
      type: "process",
      executionTime: "~1s",
      inputs: [
        {
          name: "data",
          type: "any",
          description: "Data to validate",
          required: true,
        },
        {
          name: "schema",
          type: "object",
          description: "Validation schema or rules",
          required: true,
        },
      ],
      outputs: [
        {
          name: "isValid",
          type: "boolean",
          description: "Whether the data is valid",
        },
        {
          name: "errors",
          type: "array",
          description: "Validation errors if any",
        },
      ],
    },
    {
      id: "worker-8",
      name: "PDF Generator",
      description: "Generates PDF documents from templates and data",
      type: "process",
      executionTime: "~3s",
      inputs: [
        {
          name: "template",
          type: "string",
          description: "PDF template (HTML or template path)",
          required: true,
        },
        {
          name: "data",
          type: "object",
          description: "Data to populate the template",
          required: true,
        },
        {
          name: "options",
          type: "object",
          description: "PDF generation options",
          required: false,
        },
      ],
      outputs: [
        {
          name: "pdfBuffer",
          type: "buffer",
          description: "Generated PDF as buffer",
        },
        {
          name: "pageCount",
          type: "number",
          description: "Number of pages in the PDF",
        },
      ],
    },
    {
      id: "worker-9",
      name: "Image Processor",
      description: "Processes and transforms images (resize, crop, filter, etc.)",
      type: "process",
      executionTime: "~2s",
      inputs: [
        {
          name: "imagePath",
          type: "string",
          description: "Path to the image file",
          required: true,
        },
        {
          name: "operations",
          type: "array",
          description: "List of operations to perform",
          required: true,
        },
        {
          name: "outputFormat",
          type: "string",
          description: "Output image format (jpg, png, webp)",
          defaultValue: "jpg",
          required: false,
        },
      ],
      outputs: [
        {
          name: "processedImage",
          type: "buffer",
          description: "Processed image as buffer",
        },
        {
          name: "metadata",
          type: "object",
          description: "Image metadata",
        },
      ],
    },
    {
      id: "worker-10",
      name: "Conditional Branch",
      description: "Evaluates conditions and directs workflow based on results",
      type: "process",
      executionTime: "~0.5s",
      inputs: [
        {
          name: "condition",
          type: "string",
          description: "Condition expression to evaluate",
          required: true,
        },
        {
          name: "data",
          type: "any",
          description: "Data to evaluate against",
          required: true,
        },
      ],
      outputs: [
        {
          name: "result",
          type: "boolean",
          description: "Condition evaluation result",
        },
        {
          name: "path",
          type: "string",
          description: "Path to follow (true/false)",
        },
      ],
    },
  ]
}

