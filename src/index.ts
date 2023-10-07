import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app";
import "./lib/refresh"
import reportWebVitals from "./lib/reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(React.StrictMode, null, React.createElement(App)))


// before all create a websocket to listen server-side change
// and then post-fetch to fetch the changes


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals(console.warn);
