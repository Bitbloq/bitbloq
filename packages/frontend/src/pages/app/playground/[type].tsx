import { useRouter } from "next/router";

import Playground from "../../../components/Playground";
import withApollo from "../../../apollo/withApollo";

const PlaygroundPage = () => {
  const router = useRouter();

  const { type } = router.query;

  return <Playground type={Array.isArray(type) ? type[0] : type} />;
};

export default withApollo(PlaygroundPage, { requiresSession: false });
