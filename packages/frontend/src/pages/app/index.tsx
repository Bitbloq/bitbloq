import React, { FC } from "react";
import Documents from "../../components/Documents";
import withApollo from "../../apollo/withApollo";

const AppPage: FC = props => {
  return <Documents />;
};

export default withApollo(AppPage);
