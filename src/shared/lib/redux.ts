import {
    combineReducers,
    configureStore,
    createDynamicMiddleware,
    createListenerMiddleware,
    Reducer,
} from "@reduxjs/toolkit";
import { Slice } from "@reduxjs/toolkit";
import { Api, BaseQueryFn, EndpointDefinitions } from "@reduxjs/toolkit/query";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const dynamicMiddleware = createDynamicMiddleware();

export const listenerMiddleware = createListenerMiddleware();
export const store = configureStore({
    reducer: {
        app: (store = {}) => store,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
            .prepend(listenerMiddleware.middleware)
            .prepend(dynamicMiddleware.middleware),
});

export const useAppSelector = useSelector;
export const useAppDispatch = (): typeof store.dispatch => {
    return useDispatch();
};

export function fakeBaseQuery<ErrorType>(): BaseQueryFn<void, typeof Symbol, ErrorType, object> {
    return function () {
        throw new Error(
            "When using `fakeBaseQuery`, all queries & mutations must use the `queryFn` definition syntax."
        );
    };
}

export const createBaseSelector = <S, N extends string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slice: Slice<S, any, N>
) => {
    return (store: unknown) => {
        const anyStore = store as Record<string, unknown>;
        return anyStore[slice.name] as S;
    };
};

export const useAction = <T, A extends Parameters<typeof store.dispatch>[0]>(
    factory: (p: T) => A
) => {
    const dispatch = useAppDispatch();

    return useCallback(
        (params: T) => {
            return dispatch(factory(params));
        },
        [dispatch, factory]
    );
};

export const useActionWithDeps = <
    T extends { deps: unknown },
    A extends Parameters<typeof store.dispatch>[0]
>(
    factory: (p: T) => A,
    deps: T["deps"]
) => {
    const dispatch = useAppDispatch();
    return useCallback(
        (params: Omit<T, "deps">) => {
            return dispatch(factory({ deps, ...params } as T));
        },
        [dispatch, factory, deps]
    );
};

const slicesSet = new Set<Slice>();
const services = new Set<Api<BaseQueryFn, EndpointDefinitions, string, string>>();

const updateReducers = () => {
    store.replaceReducer(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        combineReducers({
            ...Array.from(services).reduce<Record<string, Reducer>>((acc, service) => {
                acc[service.reducerPath] = service.reducer;
                return acc;
            }, {}),
            ...Array.from(slicesSet).reduce<Record<string, any>>((acc, slice) => {
                acc[slice.name] = slice.reducer;
                return acc;
            }, {}),
        })
    );
};

export const registerSlice = (slices: Slice[]) => {
    slices.forEach((slice) => slicesSet.add(slice));
    updateReducers();
};

export const registerService = <
    BaseQuery extends BaseQueryFn,
    Definitions extends EndpointDefinitions,
    ReducerPath extends string,
    TagTypes extends string
>(
    service: Api<BaseQuery, Definitions, ReducerPath, TagTypes>
) => {
    services.add(service as unknown as Api<BaseQueryFn, EndpointDefinitions, string, string>);
    dynamicMiddleware.addMiddleware(service.middleware);
    updateReducers();
};
