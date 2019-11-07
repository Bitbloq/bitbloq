import React, { FC } from "react";
import styled from "@emotion/styled";
import { baseStyles, colors, DialogModal, DialogModalProps } from "@bitbloq/ui";

interface IModalLayoutProps extends DialogModalProps {
  title: string;
  modalTitle: string;
}

const ModalLayout: FC<IModalLayoutProps> = ({
  title,
  modalTitle,
  ...modalProps
}) => {
  return (
    <DialogModal
      {...modalProps}
      transparentOverlay={true}
      title={modalTitle}
      isOpen={true}
    />
  );
};

export default ModalLayout;
