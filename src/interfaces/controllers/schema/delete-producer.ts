export const requestInputSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  additionalProperties: false,
  required: ["id"],
};
