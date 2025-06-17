import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from 'src/redux/apiBaseQuery';

const api = createApi({
    reducerPath: 'auth_api',
    baseQuery: apiBaseQuery(),
    endpoints: (builder) => ({
        register: builder.mutation<any, any>({
            query: (body) => ({
                url: '/register',
                method: 'POST',
                body,
            }),
        }),
        profile: builder.query<any, void>({
            query: () => ({
                url: '/me',
                method: 'GET',
            }),
        })
    }),
});

export default api;
export const { useRegisterMutation, useProfileQuery } = api;
