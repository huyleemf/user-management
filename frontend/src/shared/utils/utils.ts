import { enqueueSnackbar } from "notistack";
import { storage } from "./storage";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  /* eslint-enable no-bitwise */
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")?.[0]?.[0]}${name.split(" ")?.[1]?.[0]}`,
  };
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface HttpWrapperParams {
  url: string;
  toast?: {
    showToast: boolean;
    successMessage?: string;
    errorMessage?: string;
  };
  options?: RequestInit;
}

async function httpWrapper({ url, toast, options = {} }: HttpWrapperParams) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storage.get("accessToken") || ""}`,
        ...options.headers,
      },
    });

    const data =
      response.statusText == "No Content" ? {} : await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        storage.clear();
        window.location.href = "/sign-in";
      }

      if (toast?.showToast) {
        enqueueSnackbar(
          data.message || toast.errorMessage || "Request failed",
          {
            variant: "error",
            transitionDuration: { enter: 100, exit: 100 },
            autoHideDuration: 500,
          }
        );
      }

      throw new Error(
        data.message || toast?.errorMessage || response.statusText
      );
    }

    if (toast?.showToast && toast.successMessage) {
      enqueueSnackbar(data.message || toast.successMessage, {
        variant: "success",
      });
    }

    return data;
  } catch (error) {
    console.error("HTTP Wrapper Error:", error);
    if (error instanceof TypeError) {
      enqueueSnackbar("Network error. Please check your connection.", {
        variant: "error",
      });
    }
    throw error;
  }
}

export { a11yProps, httpWrapper, stringAvatar, stringToColor };
