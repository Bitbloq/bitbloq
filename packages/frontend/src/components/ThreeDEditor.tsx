import * as React from "react";
import { ThreeD, IThreeDRef } from "@bitbloq/3d";
import { STLLoader } from "@bitbloq/lib3d";
import { Mutation } from "react-apollo";
import { colors, Icon, withTranslate, DialogModal } from "@bitbloq/ui";
import { addShapeGroups } from "../config";
import ExportSTLModal from "./ExportSTLModal";
import { EditorProps } from "../types";
import { maxSTLFileSize } from "../config";
import { UPLOAD_STL_MUTATION } from "../apollo/queries";

const getMenuOptions = (baseMenuOptions, t, props) => [
  {
    id: "file",
    label: t("menu-file"),
    children: [
      // {
      //   id: "new-document",
      //   label: t("menu-new-document"),
      //   icon: <Icon name="new-document" />
      // },
      // {
      //   id: "open-document",
      //   label: t("menu-open-document"),
      //   icon: <Icon name="open-document" />
      // },
      // {
      //   id: "change-name",
      //   label: t("menu-change-name"),
      //   icon: <Icon name="pencil" />
      // },
      // {
      //   id: "duplicate-document",
      //   label: t("menu-duplicate-document"),
      //   icon: <Icon name="duplicate" />
      // },
      // {
      //   divider: true
      // },
      {
        id: "import-stl",
        label: t("menu-import-stl"),
        icon: <Icon name="import-stl" />
      },
      {
        divider: true
      },
      {
        id: "download-document",
        label: t("menu-download-document"),
        icon: <Icon name="download-document" />
      },
      {
        id: "download-stl",
        label: t("menu-export-stl"),
        icon: <Icon name="export-stl" />
      },
      {
        divider: true
      }
      // {
      //   id: "change-language",
      //   label: t("menu-change-language"),
      //   icon: <Icon name="earth" />
      // },
      // {
      //   divider: true
      // },
      // {
      //   id: "delete-document",
      //   label: t("menu-delete-document"),
      //   icon: <Icon name="trash" />
      // }
    ]
  },
  ...baseMenuOptions
];

class ThreeDEditor extends React.Component<EditorProps> {
  threedRef = React.createRef<IThreeDRef>();
  openSTLInput = React.createRef<HTMLInputElement>();

  readonly state = {
    showExportModal: false,
    showSTLError: ""
  };

  onMenuOptionClick = option => {
    const { onSaveDocument } = this.props;

    switch (option.id) {
      case "import-stl":
        // is user is not logged (PlayGround)
        const { isPlayground } = this.props;
        if (isPlayground) {
          this.setState({
            showSTLError:
              "Debes estar registrado para poder importar archivos STL."
          });
          return;
        }
        this.openSTLInput.current && this.openSTLInput.current.click();
        return;

      case "download-document":
        onSaveDocument && onSaveDocument();
        return;

      case "download-stl":
        this.setState({ showExportModal: true });
        return;

      default:
        return;
    }
  };

  onSTLFileSelected = (file: File, uploadSTL) => {
    // const { isPlayground } = this.props;

    if (file.size > maxSTLFileSize) {
      this.setState({
        showSTLError:
          "El archivo STL ocupa más de 5MB, intenta reducir su tamaño e impórtalo de nuevo."
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const uint8Data = new Uint8Array(reader.result as ArrayBuffer);

      let isBinarySTL = false;
      try {
        STLLoader.loadBinaryStl(uint8Data.buffer);
        isBinarySTL = true;
      } catch (e) {}

      let isTextSTL = false;
      if (!isBinarySTL) {
        try {
          STLLoader.loadTextStl(uint8Data.buffer);
          isTextSTL = true;
        } catch (e) {}
      }

      if (!isBinarySTL && !isTextSTL) {
        this.setState({ showSTLError: "El formato del archivo no es válido" });
        return;
      }

      // if (isPlayground) {
      //   this.threedRef.current.createObject(
      //     "STLObject",
      //     { blob: { uint8Data, filetype: file.type, newfile: true } },
      //     file.name
      //   );
      // } else {

      uploadSTL({ variables: { file } }).then(({ data }) => {
        this.threedRef.current.createObject(
          "STLObject",
          { url: data.uploadSTLFile.publicUrl },
          data.uploadSTLFile.filename
        );
      });
      // }
    };

    reader.readAsArrayBuffer(file);
  };

  render() {
    const {
      content,
      brandColor,
      tabIndex,
      onTabChange,
      getTabs,
      title,
      onEditTitle,
      onContentChange,
      headerButtons,
      headerRightContent,
      onHeaderButtonClick,
      preMenuContent,
      t,
      changeAdvancedMode,
      documentAdvancedMode,
      backCallback
    } = this.props;
    const { showExportModal, showSTLError } = this.state;

    return (
      <>
        <ThreeD
          brandColor={brandColor}
          threeDRef={this.threedRef}
          initialContent={content}
          tabIndex={tabIndex}
          onTabChange={onTabChange}
          title={title}
          onEditTitle={onEditTitle}
          menuOptions={base => getMenuOptions(base, t, this.props)}
          addShapeGroups={base => [...base, ...addShapeGroups]}
          onMenuOptionClick={this.onMenuOptionClick}
          onContentChange={onContentChange}
          headerButtons={headerButtons}
          headerRightContent={headerRightContent}
          onHeaderButtonClick={onHeaderButtonClick}
          preMenuContent={preMenuContent}
          changeAdvancedMode={changeAdvancedMode}
          documentAdvancedMode={documentAdvancedMode}
          backCallback={backCallback}
        >
          {getTabs}
        </ThreeD>
        {showExportModal && (
          <ExportSTLModal
            onCancel={() => this.setState({ showExportModal: false })}
            onSave={(name, separate) => {
              this.setState({ showExportModal: false });
              this.threedRef.current.exportToSTL(name, separate);
            }}
          />
        )}
        <Mutation mutation={UPLOAD_STL_MUTATION}>
          {uploadSTL => (
            <input
              ref={this.openSTLInput}
              type="file"
              accept="model/stl, model/x.stl-binary, model/x.stl-ascii"
              onChange={e =>
                this.onSTLFileSelected(e.target.files[0], uploadSTL)
              }
              style={{ display: "none" }}
            />
          )}
        </Mutation>
        <DialogModal
          isOpen={!!showSTLError}
          title="Aviso"
          text={showSTLError}
          okText="Aceptar"
          onOk={() => this.setState({ showSTLError: "" })}
        />
      </>
    );
  }
}

export default withTranslate(ThreeDEditor);
