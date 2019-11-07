import { useRouter } from "next/router";

import EditExercise from "../../../../components/EditExercise";
import withApollo from "../../../../apollo/withApollo";

const EditExercisePage = () => {
  const router = useRouter();

  const { id, type } = router.query;

  return <EditExercise id={id as string} type={type as string} />;
};

EditExercisePage.getInitialProps = async () => {
  return {
    tempSession: "exercise-team"
  };
};

export default withApollo(EditExercisePage, { tempSession: "exercise-team" });
