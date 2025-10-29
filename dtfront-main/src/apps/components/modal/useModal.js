import { useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState(false);
  const toggleModal = () => {
    setOpen(!open);
  };

  return { open, toggleModal };
};

export default useModal;
