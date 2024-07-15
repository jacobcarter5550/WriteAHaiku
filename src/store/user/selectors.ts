import { fetchUser } from "./index.ts";
import { AppDispatch, RootState } from "..";

export const initGetUser = () => (dispatch: AppDispatch) => {
  console.log("initGetUser")
  // dispatch(fetchUser());
};

export const staticGetUser = (state: RootState) => state.app.userUpdater.user;
