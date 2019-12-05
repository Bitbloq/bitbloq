import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import styled from "@emotion/styled";
import { useApolloClient } from "@apollo/react-hooks";
import { Input, Button } from "@bitbloq/ui";
import { EXERCISE_BY_CODE_QUERY } from "../apollo/queries";

export interface IOpenExerciseForm {
  openText?: string;
}

const OpenExerciseForm: FC<IOpenExerciseForm> = ({
  openText = "Ir al ejercicio"
}) => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const client = useApolloClient();

  const [exerciseCode, setExerciseCode] = useState("");
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);

  const onSubmitForm = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.keyCode === 13 &&
        submitRef.current &&
        openText === "Ir al ejercicio"
      ) {
        e.preventDefault();
        submitRef.current.click();
      }
    },
    [submitRef.current]
  );

  useLayoutEffect(() => {
    console.log(submitRef.current);
    window.removeEventListener("keypress", onSubmitForm);
    window.addEventListener("keypress", onSubmitForm);
    return () => window.removeEventListener("keypress", onSubmitForm);
  }, [onSubmitForm]);

  const onOpenExercise = async () => {
    if (exerciseCode) {
      try {
        setLoadingExercise(true);
        const {
          data: { exerciseByCode: exercise }
        } = await client.query({
          query: EXERCISE_BY_CODE_QUERY,
          variables: { code: exerciseCode }
        });
        setLoadingExercise(false);
        setExerciseError(false);
        setExerciseCode("");
        window.open(`/app/exercise/${exercise.type}/${exercise.id}`);
      } catch (e) {
        setLoadingExercise(false);
        setExerciseError(true);
      }
    }
  };

  return (
    <Form>
      <label>Código del ejercicio</label>
      <Input
        type="text"
        placeholder="Código del ejercicio"
        value={exerciseCode}
        error={exerciseError}
        onChange={e => setExerciseCode(e.target.value)}
      />
      {exerciseError && <Error>El código no es válido</Error>}
      <Button
        ref={submitRef}
        onClick={() => onOpenExercise()}
        disabled={loadingExercise}
      >
        {openText}
      </Button>
    </Form>
  );
};

export default OpenExerciseForm;

/* styled components */

const Form = styled.div`
  label {
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  }

  input {
    font-family: Roboto Mono;
  }

  button {
    margin-top: 30px;
    width: 100%;
  }
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;
