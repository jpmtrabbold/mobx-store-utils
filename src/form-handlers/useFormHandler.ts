import { useMemo } from 'react';
import FormInputHandler, { FormInputHandlerProps, StandardErrorProps } from './FormInputHandler';

export type UseMultipleFormHandlerProps<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> =
    Omit<FormInputHandlerProps<T, P, A, E>, 'store'>

export type UseFormHandlerProps<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> =
    FormInputHandlerProps<T, P, A, E> | UseMultipleFormHandlerProps<T, P, A, E>

export default function useFormHandler<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps>
    (props: FormInputHandlerProps<T, P, A, E>): FormInputHandler<T, P, A, E>;
export default function useFormHandler<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps>
    (store: T, inputs: UseMultipleFormHandlerProps<T, P, A, E>[]): Record<P, FormInputHandler<T, P, A, E>>;
export default function useFormHandler<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps>
    (propsOrStore: FormInputHandlerProps<T, P, A, E> | T, inputs?: UseMultipleFormHandlerProps<T, P, A, E>[]) {

    return useMemo(() => {
        if (inputs) {
            const store = propsOrStore as T
            return inputs.reduce((map, input) => {
                map[input.propertyName] = new FormInputHandler({ store, ...input });
                return map;
            }, {} as Partial<Record<P, FormInputHandler<T, P, A, E>>>);

        } else {
            const singleInputProps = propsOrStore as FormInputHandlerProps<T, P, A, E>
            return new FormInputHandler(singleInputProps)
        }
    }, [propsOrStore, inputs])
}