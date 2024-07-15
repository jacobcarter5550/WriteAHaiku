import React, { ReactNode } from "react";
import { Dialog, IconButton, Stack } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { DefaultModalProps } from "./ModalType";
import Button from "../buttonTP.tsx";

const LargeModal: React.FC<DefaultModalProps> = ({
  children,
  closeDialog,
  open,
  style,
  decrementPage,
  incrementPage,
  buttons,
  hideCloseButton,
  buttonStyles,
}) => {
  const theme = useTheme();
  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          style: {
            height: "auto",
            minHeight: "90vh",
            padding: "1em",
            display: "flex",
            alignItems: "center",
            width: "96vw",
            maxWidth: "none",
            backgroundColor: theme.palette.background.default,
            ...style,
          },
        }}
      >
        {!hideCloseButton && (
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={closeDialog}
          >
            <Close />
          </IconButton>
        )}
        {children}
        {!buttons ? (
          <Stack
            style={buttonStyles!}
            direction="row-reverse"
            alignItems="center"
            width="97%"
            mt="1em"
            spacing={2}
          >
            <Button
              className={"pop-btn"}
              label="Next"
              onClick={incrementPage}
            />

            <Button
              className={"pop-btnNeg"}
              label="Back"
              onClick={decrementPage}
            />
          </Stack>
        ) : (
          <>{buttons}</>
        )}
      </Dialog>
    </>
  );
};

export default LargeModal;
