import { useRouter } from "next/router";

import ViewSubmission from "../../../../components/ViewSubmission";
import withApollo from "../../../../apollo/withApollo";

const ViewSubmissionPage = () => {
  const router = useRouter();

  const { id, type } = router.query;

  return <ViewSubmission id={id as string} type={type as string} />;
};

export default withApollo(ViewSubmissionPage);
