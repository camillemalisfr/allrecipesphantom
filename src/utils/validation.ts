import Ajv from 'ajv';
import { argumentSchema } from '../schemas/argument';
import { Arguments } from '../types';

const ajv = new Ajv();
const validate = ajv.compile(argumentSchema);

export function validateArgs(busterArguments: object): Arguments {
  if (!validate(busterArguments)) {
    throw new Error(JSON.stringify(validate.errors));
  }
  return busterArguments as Arguments;
}
