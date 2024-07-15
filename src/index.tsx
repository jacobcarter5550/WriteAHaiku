import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import reportWebVitals from "./helpers/reportWebVitalsTP.ts";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { Provider } from "react-redux";
// import store from "./redux/storeTP.ts";
import { store } from "../src/store/index.ts";
import 'gridstack/dist/gridstack.min.css';


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <Provider store={store}>
      {/* <Provider store={store2}> */}
        <App />
      {/* </Provider> */}
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
