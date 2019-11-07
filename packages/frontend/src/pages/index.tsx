import React, { FC, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { NextPage } from "next";
import Router from "next/router";
import withApollo, { IContext } from "../apollo/withApollo";
import redirect from "../lib/redirect";
import {
  baseStyles,
  colors,
  Input,
  Button,
  Icon,
  DropDown,
  HorizontalRule,
  Spinner,
  useTranslate
} from "@bitbloq/ui";
import { useApolloClient } from "@apollo/react-hooks";
import { ME_QUERY, EXERCISE_BY_CODE_QUERY } from "../apollo/queries";
import AppHeader from "../components/AppHeader";
import LandingExamples from "../components/LandingExamples";
import Layout from "../components/Layout";
import NewDocumentDropDown from "../components/NewDocumentDropDown";
import logoBetaImage from "../images/logo-beta.svg";
import { documentTypes } from "../config";
import bqLogo from "../images/bq-logo.svg";
import studentStep1Image from "../images/student-step-1.svg";
import studentStep2Image from "../images/student-step-2.svg";
import heroImage from "../images/home_beta-decoration.svg";

const IndexPage: NextPage = () => {
  const t = useTranslate();
  const client = useApolloClient();

  const [exerciseCode, setExerciseCode] = useState("");
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () =>
      setIsHeaderSticky(
        headerRef.current !== null
          ? headerRef.current.getBoundingClientRect().top < -10
          : false
      );

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const onNewDocument = (type: string) => {
    window.open(`/app/playground/${type}`);
  };

  const onOpenDocument = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

  const onFileSelected = (file: File) => {
    if (file) {
      window.open(`/app/open-document`);
      const reader = new FileReader();
      reader.onload = e => {
        const document = JSON.parse(reader.result as string);
        const channel = new BroadcastChannel("bitbloq-landing");
        channel.onmessage = event => {
          if (event.data.command === "open-document-ready") {
            channel.postMessage({ document, command: "open-document" });
            channel.close();
          }
        };
      };
      reader.readAsText(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
    <>
      <div ref={headerRef}>
        <AppHeader isSticky={isHeaderSticky}>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
            closeOnClick={false}
          >
            {(isOpen: boolean) => (
              <HeaderButton tertiary>
                <Icon name="airplane-document" />
                {t("documents.go-to-exercise")}
              </HeaderButton>
            )}
            <ExerciseDropDown>
              <ExerciseForm>
                <label>Código del ejercicio</label>
                <Input
                  type="text"
                  placeholder="Código del ejercicio"
                  value={exerciseCode}
                  error={exerciseError}
                  onChange={e => setExerciseCode(e.target.value)}
                />
                {exerciseError && <Error>El código no es válido</Error>}
                <HeaderButton
                  onClick={() => onOpenExercise()}
                  disabled={loadingExercise}
                >
                  Ir al ejercicio
                </HeaderButton>
              </ExerciseForm>
            </ExerciseDropDown>
          </DropDown>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
          >
            {(isOpen: boolean) => (
              <HeaderButton tertiary>
                <Icon name="new-document" />
                Nuevo documento
              </HeaderButton>
            )}

            <NewDocumentDropDown
              onNewDocument={onNewDocument}
              onOpenDocument={onOpenDocument}
            />
          </DropDown>
          <HeaderButton onClick={() => Router.push("/login")}>
            Entrar
          </HeaderButton>
          <HeaderButton secondary onClick={() => Router.push("/signup")}>
            Crear una cuenta
          </HeaderButton>
        </AppHeader>
      </div>
      <Layout>
        <Section>
          <Hero>
            <h1>
              <img src={logoBetaImage} alt="Bitbloq Beta" />
            </h1>
            <p>
              La plataforma más completa para trabajar el diseño 3D, la
              programación y la robótica en el aula.
            </p>
          </Hero>
          <Tools>
            <h2>
              <Icon name="new-document" />
              Crea o abre un documento
            </h2>
            <ToolsList>
              {Object.keys(documentTypes)
                .map(id => ({ ...documentTypes[id], id }))
                .map(type => (
                  <Tool key={type.id}>
                    <ToolIcon color={type.color}>
                      <Icon name={type.icon} />
                    </ToolIcon>
                    <h3>{type.label}</h3>
                    <ToolLevel>{type.level}</ToolLevel>
                    <p>{type.landingText}</p>
                    {type.supported && (
                      <Button
                        {...{ [type.buttonType]: true }}
                        onClick={() => onNewDocument(type.id)}
                      >
                        <PlusIcon>
                          <Icon name="plus" />
                        </PlusIcon>
                        Nuevo documento
                      </Button>
                    )}
                    {!type.supported && <ComingSoon>Próximamente</ComingSoon>}
                  </Tool>
                ))}
              <OpenDocumentPanel>
                <OpenDocumentIcon color="white">
                  <Icon name="open-document" />
                </OpenDocumentIcon>
                <h3>Abrir documento desde archivo</h3>
                <p>
                  Abre cualquier documento de tipo .bitbloq que hayas guardado
                  en tu ordenador.
                </p>
                <OpenDocumentButton quaternary onClick={() => onOpenDocument()}>
                  <Icon name="open-document" />
                  Abrir documento
                </OpenDocumentButton>
              </OpenDocumentPanel>
            </ToolsList>
          </Tools>
        </Section>
        <Section>
          <OpenExercise>
            <OpenExerciseInfo>
              <h2>
                <Icon name="airplane-document" />
                Ir a un ejercicio
              </h2>
              <OpenExerciseSteps>
                <OpenExerciseStep>
                  <img src={studentStep1Image} />
                  <p>
                    1. Pide a tu profesor el código del ejercicio que quieres
                    hacer.
                  </p>
                </OpenExerciseStep>
                <OpenExerciseStep>
                  <img src={studentStep2Image} />
                  <p>2. Introduce el código y pulsa en “Empezar”.</p>
                </OpenExerciseStep>
              </OpenExerciseSteps>
            </OpenExerciseInfo>
            <OpenExercisePanel>
              <OpenExercisePanelTitle>Ir al ejercicio</OpenExercisePanelTitle>
              <HorizontalRule small />
              <OpenExercisePanelContent>
                <ExerciseForm>
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
                    onClick={() => onOpenExercise()}
                    disabled={loadingExercise}
                  >
                    Empezar
                  </Button>
                </ExerciseForm>
              </OpenExercisePanelContent>
            </OpenExercisePanel>
          </OpenExercise>
        </Section>
        <Section>
          <LandingExamples />
        </Section>
      </Layout>
      <Footer>
        <FooterContainer>
          {/* <FooterLeft>
            <h2>Contacto</h2>
            <p>Bq Educación</p>
            <p>900 00 00 00</p>
            <p>soporte.bitbloq@bq.com</p>
          </FooterLeft> */}
          <FooterRight>
            <p>Bitbloq es un proyecto de:</p>
            <img src={bqLogo} alt="BQ" />
          </FooterRight>
        </FooterContainer>
        <LegalLinks>
          <a href="#">Condiciones generales</a>
          {" | "}
          <a href="#">Política de privacidad</a>
          {" | "}
          <a href="#">Política de cookies</a>
        </LegalLinks>
      </Footer>
      <input
        ref={fileInputRef}
        type="file"
        onChange={e => onFileSelected(e.target.files[0])}
        style={{ display: "none" }}
      />
    </>
  );
};

IndexPage.getInitialProps = async (ctx: IContext) => {
  const { apolloClient } = ctx;
  try {
    const { data } = await apolloClient.query({
      query: ME_QUERY,
      errorPolicy: "ignore"
    });
    if (data && data.me) {
      redirect(ctx, "/app");
    }
  } catch (e) {}

  return {};
};

export default withApollo(IndexPage, { requiresSession: false });

/* styled components */

interface ILoadingProps {
  type?: string;
}

const Loading = styled(Spinner)<ILoadingProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${props =>
    (props.type && documentTypes[props.type].color) || colors.gray1};
  color: ${props => (props.type ? "white" : "inherit")};
  display: flex;
`;

const HeaderButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;

const ExerciseDropDown = styled.div`
  width: 280px;
  margin-top: 12px;
  background-color: white;
  border-radius: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  padding: 20px;

  &::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: -10px;
    left: 50%;
  }
`;

const ExerciseForm = styled.div`
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

const Section = styled.div`
  :not(:last-of-type):after {
    border-bottom: 1px solid #e0e0e0;
    content: "";
    left: 0;
    position: absolute;
    width: 100vw;
  }
`;

const Hero = styled.div`
  padding: 0px 50px;
  box-sizing: border-box;
  background-color: #f1f1f1;
  background-image: url(${heroImage});
  background-repeat: no-repeat;
  background-position: right center;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  img {
    height: 90px;
    margin-bottom: 30px;
    margin-top: 125px;
  }

  p {
    font-size: 22px;
    font-weight: 300;
    line-height: 1.36;
    margin-bottom: 125px;
    max-width: 512px;
  }
`;

const Tools = styled.div`
  margin-top: 60px;

  h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 20px;

    svg {
      height: 36px;
      margin-right: 10px;
    }
  }
`;

const ToolsList = styled.div`
  display: flex;
  width: 83.33%;
  margin-left: 8.33%;
  flex-wrap: wrap;
`;

const Tool = styled.div`
  width: 33%;
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 20px;

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    line-height: 1.57;
    margin-bottom: 20px;
  }
`;

const OpenDocumentPanel = styled(Tool)`
  border-radius: 10px;
  background-color: #f1f1f1;
  align-self: flex-start;
`;

interface IToolIconProps {
  color: string;
}

const ToolIcon = styled.div<IToolIconProps>`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;

  svg {
    width: 40px;
  }
`;

const OpenDocumentIcon = styled(ToolIcon)`
  color: inherit;
  svg {
    width: 32px;
  }
`;

const OpenDocumentButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 16px;
    margin-right: 6px;
  }
`;

const ToolLevel = styled.div`
  border: solid 1px #373b44;
  margin-bottom: 10px;
  padding: 0px 6px;
  font-weight: 300;
  font-size: 12px;
  height: 20px;
  display: inline-flex;
  text-transform: uppercase;
  align-items: center;
`;

const PlusIcon = styled.div`
  svg {
    margin-right: 6px;
    width: 16px;
    height: 16px;
  }
`;

const ComingSoon = styled.div`
  height: 40px;
  border-radius: 4px;
  background-color: #5d6069;
  display: inline-flex;
  align-items: center;
  padding: 0px 26px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
`;

const OpenExercise = styled.div`
  width: 83.33%;
  display: flex;
  margin: 80px 0px 80px 8.33%;
`;

const OpenExerciseInfo = styled.div`
  margin-bottom: 40px;
  width: 66%;

  h2 {
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 40px;

    svg {
      height: 36px;
      margin-right: 10px;
    }
  }
`;

const OpenExerciseSteps = styled.div`
  display: flex;
`;

const OpenExerciseStep = styled.div`
  display: flex;
  flex: 1;
  padding-right: 20px;
  box-sizing: border-box;
  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  p {
    font-size: 14px;
    line-height: 1.57;
  }
`;

const OpenExercisePanel = styled.div`
  border-radius: 10px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 33%;
`;

const OpenExercisePanelTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 18px;
  font-weight: bold;
`;

const OpenExercisePanelContent = styled.div`
  padding: 30px;
`;

const Footer = styled.div`
  color: white;
  font-size: 14px;
  background-color: #5d6069;
`;

const FooterContainer = styled(Layout)`
  display: flex;
  padding: 40px 50px;
  justify-content: flex-end;
`;

const FooterLeft = styled.div`
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p {
    margin-top: 10px;
  }
`;

const FooterRight = styled.div`
  display: flex;
  width: 480.56px;
  align-items: center;
  p {
    margin-right: 20px;
    white-space: nowrap;
  }
`;

const LegalLinks = styled.div`
  background-color: #373b44;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8c919b;

  a {
    color: #8c919b;
    margin: 0px 10px;
    font-weight: bold;
    text-decoration: none;
  }
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;
