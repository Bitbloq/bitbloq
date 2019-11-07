import React, { useContext } from "react";

export type TranslateFn = (id: string, variables?: string[]) => string;

export const TranslateContext = React.createContext<TranslateFn>(
  (id: string) => id
);

export interface TranslateProviderProps {
  messages?: any;
  messagesFiles?: any;
  fallback?: React.ReactNode;
}

const findByString = function(object: any, selector: string) {
  if (!selector) {
    return;
  }

  const ids = selector
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");

  return ids.reduce((o, id) => {
    if (typeof o === "object" && id in o) {
      return o[id];
    } else {
      return;
    }
  }, object);
};

class TranslateProvider extends React.Component<TranslateProviderProps> {
  constructor(props) {
    super(props);
    this.state = { messages: props.messages };
  }

  componentDidMount() {
    if (this.props.messagesFiles) {
      this.getLanguageMessages();
    }
  }

  async getLanguageMessages() {
    const { messagesFiles } = this.props;
    const language = navigator.language;
    const langCode = language.split("-")[0] || language;

    const langFile = messagesFiles[langCode] || messagesFiles.en;

    const response = await fetch(langFile);
    const messages = await response.json();
    this.setState({ messages });
  }

  render() {
    const { fallback } = this.props;
    const messages = this.state.messages || {};

    const translateFn = (id: string, variables?: string[]) => {
      let translation: string = findByString(messages, id);
      if (translation) {
        if (variables) {
          variables.forEach((variable: string) => {
            translation = translation.replace("%v%", variable);
          });
        }
        return translation;
      }
      console.warn(`Missing translation for ${id}`);
      return id;
    };

    return (
      <TranslateContext.Provider value={translateFn}>
        {messages ? this.props.children : fallback}
      </TranslateContext.Provider>
    );
  }
}

export const Translate = TranslateContext.Consumer;

export interface WithTranslateProps {
  t: TranslateFn;
}

export const withTranslate = <P extends object>(
  Component: React.ComponentType<P>
) =>
  class WithTranslate extends React.Component<P> {
    render() {
      return <Translate>{t => <Component t={t} {...this.props} />}</Translate>;
    }
  };

export const useTranslate = () => {
  return useContext(TranslateContext);
};

export default TranslateProvider;
