import { useRouter } from "next/router";

import EditDocument from "../../../../../components/EditDocument";
import withApollo from "../../../../../apollo/withApollo";

const EditDocumentPage = () => {
  const router = useRouter();

  const { id, folder, type } = router.query;

  return (
    <EditDocument
      id={id as string}
      folder={folder as string}
      type={type as string}
    />
  );
};

export default withApollo(EditDocumentPage);
