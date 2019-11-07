import gql from "graphql-tag";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      rootFolder
      email
      name
      admin
      publisher
      teacher
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      content
      image {
        image
        isSnapshot
      }
      public
      example
      advancedMode
      parentsPath {
        id
      }
    }
  }
`;

export const OPEN_PUBLIC_DOCUMENT_QUERY = gql`
  query OpenPublicDocument($id: ObjectID!) {
    openPublicDocument(id: $id) {
      id
      type
      title
      description
      content
      image {
        image
        isSnapshot
      }
      public
      advancedMode
    }
  }
`;

export const DOCS_FOLDERS_PAGE_QUERY = gql`
  query documentsAndFolders(
    $currentLocation: ObjectID
    $currentPage: Number
    $itemsPerPage: Number
    $order: String
    $searchTitle: String
  ) {
    documentsAndFolders(
      currentLocation: $currentLocation
      currentPage: $currentPage
      itemsPerPage: $itemsPerPage
      order: $order
      searchTitle: $searchTitle
    ) {
      result {
        id
        title
        type
        createdAt
        updatedAt
        image
        parent
      }
      parentsPath {
        id
        name
      }
      pagesNumber
      nFolders
    }
  }
`;

export const HAS_EXERCISES_QUERY = gql`
  query HasExercises($id: ObjectID!, $type: String) {
    hasExercises(id: $id, type: $type)
  }
`;

export const DOCUMENTS_QUERY = gql`
  query Documents {
    documents {
      id
      type
      title
      createdAt
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const FOLDERS_QUERY = gql`
  query Folders {
    folders {
      id
      name
    }
  }
`;

export const ROOT_FOLDER_QUERY = gql`
  query RootFolder {
    rootFolder {
      id
      name
      documents {
        id
        type
        title
        createdAt
        image {
          image
          isSnapshot
        }
      }
      folders {
        id
        name
      }
    }
  }
`;

export const FOLDER_QUERY = gql`
  query folder($id: ObjectID!) {
    folder(id: $id) {
      id
      name
      parentsPath {
        id
        name
      }
      documents {
        id
        type
        title
        createdAt
        updatedAt
        image
        description
        advancedMode
        content
        folder
        exercises {
          title
          code
        }
      }
      folders {
        id
        name
        parent
        createdAt
        updatedAt
      }
    }
  }
`;

export const EXAMPLES_QUERY = gql`
  query Examples {
    examples {
      id
      type
      title
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!
    $title: String!
    $description: String
    $content: String
    $advancedMode: Boolean
    $folder: ObjectID
    $image: DocImageIn
  ) {
    createDocument(
      input: {
        type: $type
        title: $title
        description: $description
        content: $content
        advancedMode: $advancedMode
        folder: $folder
        image: $image
      }
    ) {
      id
      type
    }
  }
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation createFolder($input: FolderIn) {
    createFolder(input: $input) {
      id
    }
  }
`;

export const UPDATE_FOLDER_MUTATION = gql`
  mutation updateFolder($id: ObjectID!, $input: FolderIn) {
    updateFolder(id: $id, input: $input) {
      id
    }
  }
`;

export const DUPLICATE_FOLDER_MUTATION = gql`
  mutation duplicateFolder($id: ObjectID!) {
    duplicateFolder(id: $id) {
      id
    }
  }
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteFolder($id: ObjectID!) {
    deleteFolder(id: $id) {
      id
    }
  }
`;

export const SET_DOCUMENT_IMAGE_MUTATION = gql`
  mutation SetDocumentImage(
    $id: ObjectID
    $image: Upload
    $isSnapshot: Boolean
  ) {
    setDocumentImage(id: $id, image: $image, isSnapshot: $isSnapshot) {
      id
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $title: String
    $content: String
    $description: String
    $advancedMode: Boolean
    $folder: ObjectID
  ) {
    updateDocument(
      id: $id
      input: {
        title: $title
        content: $content
        description: $description
        advancedMode: $advancedMode
        folder: $folder
      }
    ) {
      id
      type
      content
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocument($id: ObjectID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;

export const DOCUMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnDocumentUpdated {
    documentUpdated {
      id
    }
  }
`;

export const SUBMISSION_UPDATED_SUBSCRIPTION = gql`
  subscription OnSubmisisonUpdated($exercise: ObjectID!) {
    submissionUpdated(exercise: $exercise) {
      id
      active
    }
  }
`;

export const SUBMISSION_ACTIVE_SUBSCRIPTION = gql`
  subscription OnSubmissionActive($token: String!) {
    submissionActive(token: $token) {
      id
      active
    }
  }
`;

export const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      title
      code
      teacherName
      content
      description
      image
    }
  }
`;

export const EXERCISE_BY_CODE_QUERY = gql`
  query ExerciseByCode($code: String!) {
    exerciseByCode(code: $code) {
      id
      type
      teacherName
    }
  }
`;

export const EXERCISE_UPDATE_MUTATION = gql`
  mutation UpdateExercise($id: ObjectID!, $input: ExerciseIn) {
    updateExercise(id: $id, input: $input) {
      id
      type
      title
      code
      teacherName
      content
      description
      image
    }
  }
`;

export const EXERCISE_DELETE_MUTATION = gql`
  mutation DeleteExercise($id: ObjectID!) {
    deleteExercise(id: $id) {
      id
    }
  }
`;

export const STUDENT_SUBMISSION_QUERY = gql`
  query Submission {
    submission {
      id
      content
    }
  }
`;

export const UPDATE_SUBMISSION_MUTATION = gql`
  mutation UpdateSubmission($content: String, $active: Boolean) {
    updateSubmission(input: { content: $content, active: $active }) {
      id
    }
  }
`;

export const SET_ACTIVESUBMISSION_MUTATION = gql`
  mutation SetActiveSubmission($submissionID: ObjectID!, $active: Boolean!) {
    setActiveSubmission(submissionID: $submissionID, active: $active) {
      id
      active
    }
  }
`;

export const UPDATE_PASSWORD_SUBMISSION_MUTATION = gql`
  mutation UpdatePasswordSubmission($id: ObjectID!, $password: String!) {
    updatePasswordSubmission(submissionID: $id, password: $password) {
      id
    }
  }
`;

export const FINISH_SUBMISSION_MUTATION = gql`
  mutation FinishSubmission($content: String!) {
    finishSubmission(content: $content) {
      id
    }
  }
`;

export const REMOVE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($submissionID: ObjectID!) {
    deleteSubmission(submissionID: $submissionID) {
      id
    }
  }
`;

export const UPLOAD_STL_MUTATION = gql`
  mutation uploadSTLFile($file: Upload!, $documentId: ObjectID) {
    uploadSTLFile(file: $file, documentID: $documentId) {
      id
      filename
      mimetype
      publicUrl
      document
    }
  }
`;

export const PUBLISH_DOCUMENT_MUTATION = gql`
  mutation publishDocument(
    $id: ObjectID!
    $public: Boolean
    $example: Boolean
  ) {
    publishDocument(id: $id, public: $public, example: $example) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const RENEW_TOKEN_MUTATION = gql`
  mutation RenewToken {
    renewToken
  }
`;

export const CHECK_RESET_PASSWORD_TOKEN_MUTATION = gql`
  mutation CheckResetPasswordToken($token: String) {
    checkResetPasswordToken(token: $token)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: EmailAddress!) {
    resetPasswordEmail(email: $email)
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($token: String, $newPassword: String) {
    updatePassword(token: $token, newPassword: $newPassword)
  }
`;

export const START_SUBMISSION_MUTATION = gql`
  mutation StartSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    startSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;

export const LOGIN_SUBMISSION_MUTATION = gql`
  mutation LoginSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    loginSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;
