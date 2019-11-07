import React, { FC } from "react";
import Activate from "../../components/Activate";
import withApollo from "../../apollo/withApollo";

const ActivatePage: FC = props => {
  return <Activate />;
};

export default withApollo(ActivatePage, { requiresSession: false });
