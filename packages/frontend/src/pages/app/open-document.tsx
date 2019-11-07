import React, { FC } from "react";
import Playground from "../../components/Playground";
import withApollo from "../../apollo/withApollo";

const OpenDocumentPage: FC = props => {
  return <Playground openDocument={true} />;
};

export default withApollo(OpenDocumentPage);
