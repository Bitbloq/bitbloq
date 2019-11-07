import Document, { Html, Head, Main, NextScript } from "next/document";
import { Global, css } from "@emotion/core";
import { baseStyles } from "@bitbloq/ui";
import favicon from "../images/favicon.png";

export default class BitbloqDocument extends Document {
  public render() {
    return (
      <Html>
        <Global styles={baseStyles} />
        <Head>
          <link rel="icon" type="image/png" href={favicon} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
