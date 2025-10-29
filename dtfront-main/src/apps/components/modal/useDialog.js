import { closeDialogCall, openDialogCall } from "apps/store/reducers/dialog";
import { useDispatch, useSelector } from "react-redux";

const useDialog = () => {
  const dispatch = useDispatch();

  const type = useSelector((state) => state.dialog.type);
  const show = useSelector((state) => state.dialog.show);
  const message = useSelector((state) => state.dialog.message);
  const title = useSelector((state) => state.dialog.title);
  const confirmHandler = useSelector((state) => state.dialog.confirmHandler);
  const denyHandler = useSelector((state) => state.dialog.denyHandler);

  const open = (param) => {
    dispatch(openDialogCall(param));
  };

  const openD = (param) => {
    dispatch(openDialogCall(param));
  };

  const openDialog = (param) => {
    dispatch(openDialogCall(param));
  };

  const close = () => {
    dispatch(closeDialogCall());
  };

  return {
    type,
    show,
    message,
    title,
    confirmHandler,
    denyHandler,
    open,
    openD,
    openDialog,
    close,
  };
};

export default useDialog;
