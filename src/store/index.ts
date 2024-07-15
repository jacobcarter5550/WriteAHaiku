import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createLogger } from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { nonPersistedReducers, reducers } from "./separateReducers.ts";
import { thunk } from "redux-thunk";

/** Must be last in the middleware chain! */
const customLogger: Middleware = createLogger({
  timestamp: true,
  collapsed: true,
  duration: true,
  diff: true,
});

export const makeStore = () => {
  const persistedGlobalReducer = persistReducer(
    {
      key: "app",
      storage,
    },
    combineReducers({
      ...reducers,
    })
  );

  const rootReducer = combineReducers({
    app: persistedGlobalReducer,
    nonPersistedApp: combineReducers({
      ...nonPersistedReducers,
    }),
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REHYDRATE, REGISTER, PERSIST, PAUSE, PURGE, FLUSH],
        },
        thunk: true,
      }).concat(thunk, customLogger),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export const { store, persistor } = makeStore();

export type RootState = ReturnType<(typeof store)["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["store"]["dispatch"];
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
