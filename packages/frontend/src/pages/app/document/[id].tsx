import { useRouter } from "next/router";

import Document from "../../../components/Document";
import withApollo from "../../../apollo/withApollo";

const DocumentPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return <Document id={id as string} />;
};

export default withApollo(DocumentPage);
