import { showToast } from "nextjs-toast-notify";
import { ToastOptions } from "nextjs-toast-notify/dist/interfaces";

const toastOptions: ToastOptions = {
  duration: 3000,
  progress: false,
  position: "bottom-right",
  transition: "fadeIn",
  icon: "",
  sound: false,
};

const successToast = (message: string) => {
  showToast.success(message, toastOptions);
};

const errorToast = (message: string) => {
  showToast.error(message, toastOptions);
};

const warningToast = (message: string) => {
  showToast.warning(message, toastOptions);
};

const infoToast = (message: string) => {
  showToast.info(message, toastOptions);
};

export { successToast, errorToast, warningToast, infoToast };