import { makeAutoObservable } from 'mobx'
import { findLast } from '../utils/utils'

type FieldType<T> = keyof T
export type FormError<T> = { field: FieldType<T>, error: string }

export class FormErrorHandler<T extends any> {
    constructor() {
        makeAutoObservable(this)

    }
    errors = [] as FormError<T>[]

    /** whether there's any error in any field */
    get hasError() {
        return !!this.errors.length
    }

    /** use this method to add an error to field.
     * field must be the the string property name of the field in the model that you are setting the error
     */
    error(field: FieldType<T>, error: string) {
        this.errors.push({ field, error })
    }

    /** checks whether a field has any error */
    fieldHasError(field: FieldType<T>, errors?: FormError<T>[]) {
        const e = errors ?? this.errors
        return !!e.find(item => item.field === field)
    }
    
    /** gets the error for any specific field */
    getFieldError(field: FieldType<T>, errors?: FormError<T>[]) {
        const e = errors ?? this.errors
        return findLast(e, (item => item.field === field))?.error
    }

    /** reset error for specific field */
    resetFieldError(field: FieldType<T>) {
        this.errors = this.errors.filter(e => e.field !== field)
    }

    /** reset all errors */
    reset() {
        this.errors = []
    }
}

export default FormErrorHandler