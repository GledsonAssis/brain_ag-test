import { InputValidator } from '@/ports/input-validator'
import Ajv from "ajv"
import ajvErrors from 'ajv-errors';
import addFormats from "ajv-formats";

export class AJVCompile implements InputValidator {
    async compile(schema: InputValidator.Request, data: any): Promise<InputValidator.Response> {
        const ajv = new Ajv({ allErrors: true })
        ajvErrors(ajv)
        addFormats(ajv)
        ajv.addKeyword({
            keyword: 'isDate',
            type: 'string',
            validate: (schema: any, data: any) => {
                const date = new Date(data)
                return !isNaN(+date)
            }
        });
        ajv.removeSchema(schema)
        const validate = ajv.compile(schema)
        const valid = validate(data)
        const errorMessage: string[] = []
        if (!valid) {
            validate.errors?.forEach((element) => {
                const field = element.params.missingProperty ||
                    element.instancePath.replace(/^\//gim, '')
                return errorMessage.push(`field: ${field} - error: ${element.message}`)
            })
        }
        return { isValid: valid, message: errorMessage.join(', ') }
    }
}