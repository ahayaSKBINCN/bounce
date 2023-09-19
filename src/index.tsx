import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app";
// import reportWebVitals from "./reportWebVitals";



// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
//   const runtime = await import("react-refresh/runtime");
//   runtime.injectIntoGlobalHook(window);
//   window.$RefreshReg$ = () => {};
//   window.$RefreshSig$ = () => (type: any) => type;
// }

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const socket = new WebSocket("ws://localhost:3000/ws")
  socket.onopen = function (ev) { console.log("web-socket:open", ev)
   }
  socket.onerror = function (error) {console.log("web-socket:error", error )}
  socket.onclose = function () {console.log("web-socket:close")}
  socket.onmessage = function (message) {console.log("web-socket:message",message)}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
