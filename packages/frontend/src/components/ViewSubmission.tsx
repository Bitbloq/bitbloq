import * as React from "react";
import styled from "@emotion/styled";
import { Query } from "react-apollo";
import { colors, Spinner } from "@bitbloq/ui";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { documentTypes } from "../config";
import gql from "graphql-tag";

const SUBMISSION_QUERY = gql`
  query Submission($id: ObjectID!) {
    submission(id: $id) {
      title
      studentNick
      content
    }
  }
`;

interface IViewSubmissionProps {
  id: string;
  type: string;
}

interface IViewSubmissionState {
  tabIndex: number;
}

class ViewSubmission extends React.Component<
  IViewSubmissionProps,
  IViewSubmissionState
> {
  constructor(props) {
    super(props);

    this.state = { tabIndex: 0 };
  }

  render() {
    const { id, type } = this.props;
    const { tabIndex } = this.state;

    const documentType = documentTypes[type];
    const EditorComponent = documentType.editorComponent;

    return (
      <Query query={SUBMISSION_QUERY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (error) {
            if (error.graphQLErrors[0].extensions.code === "UNAUTHENTICATED")
              error.graphQLErrors[0].extensions.code = "NOT_YOUR_DOCUMENT";
            return <GraphQLErrorMessage apolloError={error} />;
          }
          if (loading) return <Loading />;

          const { submission } = data;
          const { title, studentNick, type } = submission;
          let content = [];
          try {
            content = JSON.parse(submission.content);
          } catch (e) {
            console.warn("Error parsing document content", e);
          }

          return (
            <EditorComponent
              brandColor={documentType.color}
              content={content}
              tabIndex={tabIndex}
              onTabChange={(tab: number) => this.setState({ tabIndex: tab })}
              getTabs={(mainTabs: any[]) => mainTabs}
              title={`${title} (${studentNick})`}
              onContentChange={() => null}
            />
          );
        }}
      </Query>
    );
  }
}

export default ViewSubmission;

/* styled components */

const Loading = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
`;
