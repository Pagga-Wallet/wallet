export type APIResponseNormal<T> = {
    isError: boolean;
    errorMessage?: string;
    data: T;
};

export type APIResponseFail = {
    isError: true;
    errorMessage?: string;
    data: null;
};

export type APIResponse<T> = APIResponseNormal<T> | APIResponseFail;
export type PromisedAPIResponse<T> = Promise<APIResponse<T>>;
