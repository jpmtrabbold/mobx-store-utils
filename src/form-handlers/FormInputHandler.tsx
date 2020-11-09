import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { OnValueChangeType, fieldValueProps, InputPropsVariant, InputPropsConfig, OnValueChangedType } from "./field-props"
import FormErrorHandler, { FormError } from './FormErrorHandler'
import FormInputWrapper from './FormInputWrapper'

export type StandardErrorProps = { error: boolean, helperText: string }

/**
 * FormInputHandler parameters
 */
export interface FormInputHandlerProps<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> {
    /**
     * object that holds the property that will be bound to this component. That property
     * has to be a mobx observable
     * @default mandatory
     */
    store: T
    /**
     * name of the property inside the store that will be bound to this component. 
     * That property has to be a mobx observable
     * @default mandatory
     */
    propertyName: P
    /**
     * in case you want to be notified about when a change will take place. Your callback
     * can return a promise that, if fulfilled with a return of false, will preven the 
     * update to happen.
     */
    onValueChange?: OnValueChangeType<A>
    /**
     * in case you want to be notified about when a change has happened
     */
    onValueChanged?: OnValueChangedType<A>
    /**
     * in case you are using a FormErrorHandler to handle the form errors
     */
    errorHandler?: FormErrorHandler<T>
    /**
     * some built-in variants
     */
    variant?: InputPropsVariant
    /**
     * some built-in configurations
     */
    config?: Omit<InputPropsConfig, 'isCheckbox'>
    /** additional data that will be passed to onValueChange and onValueChanged */
    additionalChangeData?: A
    /** adapter function that will receive the property name, errors and errorhandler and will spit out the props for the error component. 
     * default props: {error: boolean, helperText: string}
     */
    errorPropsAdapter?: (params: ErrorPropsAdapterParams<T, P>) => E
    /** adapter function that will receive the generated onChange, value props, and will possibly adapt them into different props 
     * if necessary, in case your input component doesn't use the common onChange, value props
     */
    inputPropsAdapter?: (params: InputPropsAdapterParams) => any
    /** adapter function that will receive the generated onChange, checked props, and will possibly adapt them into different props 
     * if necessary, in case your input component doesn't use the common onChange, checked props
     */
    checkboxPropsAdapter?: (params: CheckboxPropsAdapterParams) => any

}

type ErrorPropsAdapterParams<T, P> = { errorHandler?: FormErrorHandler<T>, propertyName: P, errors?: FormError<T>[] }
type InputPropsAdapterParams = { onChange: any, value?: any }
type CheckboxPropsAdapterParams = { onChange: any, checked?: any }
type GetInputPropsParams<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> =
    Pick<FormInputHandlerProps<T, P, A, E>, 'store' | 'propertyName' | 'onValueChange' | 'onValueChanged' | 'variant' | 'config' | 'additionalChangeData'>
    & { value: any }

/**
 * A React component that provides a two-way data-binding feel to your forms controlled by a mobx state.
 * It works by creating the `onChange` and `value` props and passing then down to the children input automatically.
 * It also passes down the 'helperText' and 'error' props down if an error handler is being used 
 */
export default class FormInputHandler<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> {
    constructor(props: FormInputHandlerProps<T, P, A, E>) {
        this.props = props
        if (this.props.errorPropsAdapter) {
            this.errorPropsAdapter = this.props.errorPropsAdapter
        }
        makeAutoObservable(this)
    }

    props: FormInputHandlerProps<T, P, A, E>

    private errorPropsAdapter = (params: ErrorPropsAdapterParams<T, P>) => {
        const { errorHandler } = params
        if (!errorHandler) {
            return {}
        }

        if (errorHandler.fieldHasError(params.propertyName, params.errors)) {
            return { error: true, helperText: errorHandler.getFieldError(params.propertyName, params.errors) }
        }

        return { error: false, helperText: undefined }
    }

    /** call this computed property to get the props for your error component */
    get errorProps() {
        return this.errorPropsAdapter({
            errorHandler: this.props.errorHandler,
            propertyName: this.props.propertyName,
            errors: this.props.errorHandler?.errors
        })
    }

    /** call this computed property to get the props for your input component */
    get inputProps() {
        const value = this.props.store[this.props.propertyName]
        return this.getInputProps({
            value,
            store: this.props.store,
            propertyName: this.props.propertyName,
            onValueChange: this.props.onValueChange,
            variant: this.props.variant,
            config: this.props.config,
            onValueChanged: this.props.onValueChanged,
            additionalChangeData: this.props.additionalChangeData
        })
    }

    /** call this computed property to get the props for your checkbox component */
    get checkboxProps() {
        const value = this.props.store[this.props.propertyName]
        return this.getCheckboxProps({
            value,
            store: this.props.store,
            propertyName: this.props.propertyName,
            onValueChange: this.props.onValueChange,
            variant: this.props.variant,
            config: this.props.config,
            onValueChanged: this.props.onValueChanged,
            additionalChangeData: this.props.additionalChangeData
        })
    }

    get InputWrapper() {
        return observer((props: { children: React.ReactElement }) => <FormInputWrapper handler={this} children={props.children} isCheckbox={false} />)
    }

    get CheckboxWrapper() {
        return observer((props: { children: React.ReactElement }) => <FormInputWrapper handler={this} children={props.children} isCheckbox={true} />)
    }

    private getInputProps(params: GetInputPropsParams<T, P, A, E>) {
        const isCheckbox = false
        const newFieldProps = fieldValueProps(
            params.store,
            params.propertyName,
            params.onValueChange,
            params.variant,
            { ...params.config, isCheckbox },
            params.onValueChanged,
            params.additionalChangeData
        )

        const newProps = { onChange: newFieldProps.onChange, value: newFieldProps.value }
        if (this.props.inputPropsAdapter) {
            return this.props.inputPropsAdapter(newProps)
        }
        return newProps

    }

    private getCheckboxProps(params: GetInputPropsParams<T, P, A, E>) {
        const isCheckbox = true
        const newFieldProps = fieldValueProps(
            params.store,
            params.propertyName,
            params.onValueChange,
            params.variant,
            { ...params.config, isCheckbox },
            params.onValueChanged,
            params.additionalChangeData
        )

        const newProps = { onChange: newFieldProps.onChange, checked: newFieldProps.value }
        if (this.props.checkboxPropsAdapter) {
            return this.props.checkboxPropsAdapter(newProps)
        }
        return newProps
    }
}