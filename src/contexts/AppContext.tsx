import { type ButtonProps } from "@chakra-ui/react";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

export interface AppModalInputs {
  placeholder: string;
  valueKey: string;
}

export interface AppModalOptions {
  label: string;
  func?: (values) => Promise<void> | void;
  lazy?: boolean;
  buttonProps?: ButtonProps;
}

export interface AppModalValues {
  isOpen: boolean;
  modalContent?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnOverlayClick?: boolean;
  closeButtonVisible?: boolean;
  message?: string;
  header?: string;
  options?: AppModalOptions[];
  inputs?: AppModalInputs[];
  bodyComponent?: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  canClose?: boolean;
}

interface AppContextValues {
  appModal: AppModalValues;
  setAppModal: (args: AppModalValues) => void;
}

const AppContext = createContext<AppContextValues | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [appModal, setAppModal] = useState<AppModalValues>({
    isOpen: false,
  });

  const value = {
    appModal,
    setAppModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  return context;
};
