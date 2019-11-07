import React, { FC } from "react";
import styled from "@emotion/styled";
import { Input } from "@bitbloq/ui";

interface IFormProps {
  className?: string;
  email: string;
  logingError: boolean;
  password: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginForm: FC<IFormProps> = ({
  className,
  email,
  logingError,
  password,
  setEmail,
  setPassword
}) => {
  return (
    <div className={className}>
      <FormGroup>
        <label>Correo electrónico</label>
        <Input
          name="email"
          type="text"
          placeholder="Correo electrónico"
          value={email}
          error={logingError}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <label>Contraseña</label>
        <Input
          name="email"
          type="password"
          placeholder="Contraseña"
          value={password}
          error={logingError}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      {logingError && (
        <ErrorMessage>Correo electrónico o contraseña no válidos</ErrorMessage>
      )}
    </div>
  );
};

export default LoginForm;

const ErrorMessage = styled.div`
  color: #d82b32;
  font-size: 12px;
  font-style: italic;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;
