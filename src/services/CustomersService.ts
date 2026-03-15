import ApiService from './ApiService'

export async function apiGetCustomersList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/customers',
        method: 'get',
        params,
    })
}

export async function apiGetCustomer<
    T,
    U extends Record<string, string | number>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customers/${params.id}`,
        method: 'get',
    })
}

export async function apiGetCustomerLog<
    T,
    U extends Record<string, string | number>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customers/${params.id}/log`,
        method: 'get',
    })
}
