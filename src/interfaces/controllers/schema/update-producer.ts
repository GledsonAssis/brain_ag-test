export const requestInputSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: {
      type: "string",
    },
    farms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
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
              type: "string",
            },
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
  required: ["id"],
};
