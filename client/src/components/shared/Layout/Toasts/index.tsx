import React, { ReactElement } from "react";
import { ToastContainer } from "react-toastify";

export default function Toasts(): ReactElement {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
