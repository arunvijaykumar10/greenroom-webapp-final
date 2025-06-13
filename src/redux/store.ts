import type {
    TypedUseSelectorHook
} from 'react-redux';

import _ from 'lodash';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore , combineReducers } from '@reduxjs/toolkit';
import {
    useDispatch as useAppDispatch,
    useSelector as useAppSelector,
} from 'react-redux';

import api from './api';

// ----------------------------------------------------------------------
const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [],
};

const apiReducers = _.reduce(api, (acc, val) => ({ ...acc, [val.reducerPath]: val.reducer }), {});

const rootReducer = combineReducers({
    ...apiReducers,
});

const apiMiddlewares = _.map(api, 'middleware');

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(apiMiddlewares),
});

const persistor = persistStore(store);

const { dispatch } = store;

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

const useDispatch = () => useAppDispatch<AppDispatch>();

const resetStore = () => {
    _.map(api, (apiInstance) => dispatch(apiInstance.util.resetApiState()));
};

export { store, dispatch, persistor, resetStore, useSelector, useDispatch };