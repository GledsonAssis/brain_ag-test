export const requestInputSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    document: {
      type: "string",
    },
    farms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          city: {
            type: "string",
          },
          state: {
            type: "string",
          },
          total_area_hectares: {
            type: "number",
          },
          arable_area_hectares: {
            type: "number",
          },
          vegetation_area_hectares: {
            type: "number",
          },
          crops: {
            type: "array",
            items: {
              type: "string"
            },
          },
        },
        required: [
          "name",
          "city",
          "state",
          "total_area_hectares",
          "arable_area_hectares",
          "vegetation_area_hectares",
          "crops"
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["name", "document", "farms"],
  additionalProperties: false,
};
