import { useCallback, useState } from "react";

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    close: useCallback(() => setIsOpen(false), []),
    open: useCallback(() => setIsOpen(true), []),
    toggle: useCallback(() => setIsOpen((current) => !current), []),
  };
}
