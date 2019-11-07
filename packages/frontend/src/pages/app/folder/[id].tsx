import { useRouter } from "next/router";

import Documents from "../../../components/Documents";
import withApollo from "../../../apollo/withApollo";

const FolderPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return <Documents id={id as string} />;
};

export default withApollo(FolderPage);
