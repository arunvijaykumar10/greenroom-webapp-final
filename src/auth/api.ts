import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'auth_api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    endpoints: (builder) => ({
        register: builder.mutation<any, any>({
            query: (body) => ({
                url: '/register',
                method: 'POST',
                body,
            }),
        })
    }),
});

export default api;
export const { useRegisterMutation } = api;