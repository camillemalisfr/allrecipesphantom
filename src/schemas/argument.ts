export const argumentSchema = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    pages: { type: 'number', minimum: 1, maximum: 5 }
  },
  required: ['search'],
  additionalProperties: false
};
