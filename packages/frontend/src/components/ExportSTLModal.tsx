import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, Option } from "@bitbloq/ui";

interface ExportSTLModalProps {
  onSave: (name: string, separate: boolean) => any;
  onCancel: () => any;
}

const ExportSTLModal: FC<ExportSTLModalProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [separate, setSeparate] = useState(false);

  return (
    <Modal
      isOpen={true}
      title="Exportar la escena en formato STL"
      onClose={onCancel}
    >
      <Content>
        <FormGroup>
          <label>Nombre del archivo</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del archivo"
          />
        </FormGroup>
        <OptionWrap onClick={() => setSeparate(false)}>
          <Option checked={separate === false} />
          <span>Descargar todo como un solo objeto</span>
        </OptionWrap>
        <OptionWrap onClick={() => setSeparate(true)}>
          <Option checked={separate === true} />
          <span>Descargar cada objeto por separado</span>
        </OptionWrap>
        <Buttons>
          <Button tertiary onClick={() => onCancel()}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(name, separate)}>Descargar</Button>
        </Buttons>
      </Content>
    </Modal>
  );
};

export default ExportSTLModal;

const Content = styled.div`
  width: 500px;
  padding: 40px 30px 30px 30px;
  box-sizing: border-box;
  font-size: 14px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const OptionWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;
