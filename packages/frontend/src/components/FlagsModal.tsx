import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Button,
  NumberInput,
  Icon,
  Modal,
  Checkbox,
  HorizontalRule
} from "@bitbloq/ui";
import { flags } from "../config";

const flagFields = [
  {
    key: "RENEW_TOKEN_SECONDS",
    label: "Renovar token cada (segundos)",
    type: "number"
  },
  {
    key: "TOKEN_DURATION_MINUTES",
    label: "La sesión caduca después de (minutos)",
    type: "number"
  },
  {
    key: "TOKEN_WARNING_SECONDS",
    label: "Mostrar aviso de sesión cuando falten (segundos)",
    type: "number"
  },
  {
    key: "SHOW_GRAPHQL_LOGS",
    label: "Mostrar logs de graphql",
    type: "boolean"
  }
];

const konamiCode = "38384040373937396665";
const commit = process.env.COMMIT;
const commitDate = process.env.COMMIT_DATE;
const buildDate = process.env.BUILD_DATE;
const branch = process.env.BRANCH;

const FlagsModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [flagValues, setFlagValues] = useState(flags);

  useEffect(() => {
    let input = "";
    const onKeyDown = (e: KeyboardEvent) => {
      input += e.keyCode;
      if (input.length > konamiCode.length) {
        input = input.substr(input.length - konamiCode.length);
      }
      if (input === konamiCode) {
        input = "";
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const updateValue = (key: string, value: any) => {
    setFlagValues({
      ...flagValues,
      [key]: value
    });
  };

  const onSaveClick = () => {
    window.localStorage.setItem("flags", JSON.stringify(flagValues));
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} showHeader={false}>
      <Header>
        <Icon name="cthulhito" />
      </Header>
      <HorizontalRule small />
      <Content>
        <h2>Usa el poder de Cthulhito con sabiduría</h2>
        {flagFields.map(field => (
          <FormGroup key={field.key}>
            <label>{field.label}</label>
            {field.type === "number" && (
              <NumberInput
                value={flagValues[field.key]}
                onChange={(value: number) => updateValue(field.key, value)}
              />
            )}
            {field.type === "boolean" && (
              <Checkbox
                checked={flagValues[field.key]}
                onChange={() => updateValue(field.key, !flagValues[field.key])}
              />
            )}
          </FormGroup>
        ))}
        <Buttons>
          <Button onClick={() => setIsOpen(false)} tertiary>
            Cerrar
          </Button>
          <Button onClick={onSaveClick}>Guardar y recargar</Button>
        </Buttons>
        <br />
        <HorizontalRule small />
        <VersionInfo>
          <b>Last commit:</b> {commit}
          {"  "}@ <b>{branch}</b>
          <br />
          <b>Commit date:</b> {commitDate} GMT
          <br />
          <b>Build date:</b> {buildDate} GMT
          <br />
        </VersionInfo>
      </Content>
    </Modal>
  );
};

export default FlagsModal;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 120px;
  }
`;

const Content = styled.div`
  padding: 30px;
  h2 {
    text-align: center;
    margin-bottom: 40px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;

  label {
    display: block;
    width: 300px;
  }

  input {
    width: 100px;
  }
`;

const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const VersionInfo = styled.p`
  font-size: 12px;
  line-height: 1.5;
  margin-top: 20px;
  b {
    display: inline-block;
    width: 80px;
  }
`;
