"use client";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

export function AppSnackbarProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

export function useSnackbar() {
  return {
    showSnackbar: (message, variant = "default") =>
      enqueueSnackbar(message, { variant }),
  };
}
