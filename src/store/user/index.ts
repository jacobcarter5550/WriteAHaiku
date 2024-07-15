import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getLocalAccessToken } from "../../helpers/serviceTP.ts";
import axios from "axios";

export type UserState = {
  user: any;
};

const initialState: UserState = {
  user: [],
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { dispatch }) => {
    try {
      const token = getLocalAccessToken();

      const res = await axios.options(
        `http://${process.env.REACT_APP_HOST_IP_ADDRESS}:8180/admin/realms/linvest21realm/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            AcceptEncoding: "gzip, deflate, br",
            Connection: "keep-alive",
          },
        }
      );
      console.log(res.data);
      const response = await api.get("/user");
      console.log(response.data);
      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      dispatch(
        setUser({
          email: "david.d.lin@linvest21.com",
        })
      );
      console.log(error);
      return {
        email: "david.d.lin@linvest21.com",
      };
    }
  }
);

export const userUpdater = createSlice({
  name: "userUpdater",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userUpdater.actions;

export default userUpdater.reducer;
