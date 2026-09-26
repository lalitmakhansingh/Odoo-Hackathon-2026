import { useState } from "react";

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (
    message,
    type = "success"
  ) => {
    const id =
      Date.now() +
      Math.random();

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message,
        type,
      },
    ]);
  };

  const removeToast = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter(
        (toast) => toast.id !== id
      )
    );
  };

  const success = (message) => {
    addToast(message, "success");
  };

  const error = (message) => {
    addToast(message, "error");
  };

  const warning = (message) => {
    addToast(message, "warning");
  };

  const info = (message) => {
    addToast(message, "info");
  };

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

export default useToast;