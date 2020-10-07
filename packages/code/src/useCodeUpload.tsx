import React, { useState, useEffect, useRef } from "react";
import Borndate from "@bitbloq/borndate";
import { DialogModal, useTranslate } from "@bitbloq/ui";
import Avrgirl from "avrgirl-arduino";
import UploadSpinner from "./UploadSpinner";
import { knownBoards } from "./config";
declare let chrome: any;

export enum UploadErrorType {
  CHROME_APP_MISSING = "chrome-app-missing",
  COMPILE_ERROR = "compile-error",
  BOARD_NOT_FOUND = "board-not-found",
  CANCELED = "canceled"
}

const errorMessages = {
  [UploadErrorType.CHROME_APP_MISSING]: "Can't connect with chrome app",
  [UploadErrorType.COMPILE_ERROR]: "Error compiling source code",
  [UploadErrorType.BOARD_NOT_FOUND]: "Can't connect with board"
};

const CHROME_APP_TIMEOUT = 1000;

class UploadError extends Error {
  public type: string;
  public data?: any;

  constructor(type: string, data?: any) {
    super(errorMessages[type]);
    this.name = this.constructor.name;
    this.type = type;
    this.data = data;
  }
}

class Uploader {
  private borndate: Borndate;
  private lastSendPromise: Promise<unknown> = Promise.resolve();

  constructor(filesRoot: string) {
    this.borndate = new Borndate({ filesRoot });
  }

  public openPort(board: string) {
    return new Promise((resolve, reject) => {
      const avrgirl = new Avrgirl({
        board
      });
      const connection = avrgirl.connection;
      let serialPortError = null;
      connection._init(() => null);
      connection._init = cb => cb(null);
      const boardConfig = knownBoards[board];
      if (boardConfig) {
        connection.serialPort.requestOptions = {
          filters: [
            {
              usbVendorId: boardConfig.vendorId
            }
          ]
        };
      }
      // TODO: Temporal patch of open and set methods.
      // Remove when these changes land in avrgirl
      connection.serialPort.open = function(callback) {
        (window.navigator as any).serial
          .requestPort(this.requestOptions)
          .then(serialPort => {
            this.port = serialPort;
            if (this.isOpen) return;
            return this.port.open({
              baudrate: this.baudrate || 57600,
              baudRate: this.baudrate || 57600
            });
          })
          .then(() => (this.writer = this.port.writable.getWriter()))
          .then(() => (this.reader = this.port.readable.getReader()))
          .then(async () => {
            this.emit("open");
            this.isOpen = true;
            callback(null);
            while (this.port.readable.locked) {
              try {
                const { value, done } = await this.reader.read();
                if (done) {
                  break;
                }
                this.emit("data", Buffer.from(value));
              } catch (e) {
                console.error(e);
              }
            }
          })
          .catch(error => {
            callback(error);
          });
      };
      connection.serialPort.set = async function(props, callback) {
        try {
          await this.port.setSignals(
            Object.assign(
              {
                dataTerminalReady: props.dtr,
                requestToSend: props.rts,
                break: props.brk
              },
              props
            )
          );
        } catch (error) {
          if (callback) return callback(error);
          throw error;
        }
        if (callback) return callback(null);
      };

      connection.serialPort.open(error => {
        if (error) {
          serialPortError = error;
          reject(error);
        } else {
          resolve(avrgirl);
        }
      });
      connection.serialPort.open = cb => cb(serialPortError);
    });
  }

  public compile(code: any[], libraries: any[] = [], board: string) {
    return new Promise((resolve, reject) => {
      const boardConfig = knownBoards[board];
      this.borndate
        .compile(boardConfig.borndateId, code, libraries)
        .then(resolve)
        .catch(e => reject(new UploadError("compile-error", e.errors)));
    });
  }

  public upload(
    code: any[],
    libraries: any[] = [],
    board: string,
    onPortOpen?: () => void
  ) {
    let isCanceled = false;

    const cancel = () => {
      isCanceled = true;
    };

    const promise = new Promise<void>((resolve, reject) => {
      const boardConfig = knownBoards[board];
      this.openPort(board)
        .then((avrgirl: Avrgirl) => {
          if (onPortOpen) {
            onPortOpen();
          }

          return this.borndate
            .compile(boardConfig.borndateId, code, libraries)
            .then(hex => [avrgirl, hex])
            .catch(e => {
              try {
                avrgirl.connection.serialPort.reader.cancel();
                avrgirl.connection.serialPort.close();
              } catch (e) {
                console.log(e);
              }
              reject(new UploadError("compile-error", e.errors));
            });
        })
        .catch(e => {
          if (isCanceled) {
            reject(new UploadError("canceled"));
            return;
          }
          reject(new UploadError("board-not-found"));
        })
        .then(([avrgirl, hex]) => {
          if (isCanceled) {
            avrgirl.connection.serialPort.reader.cancel();
            avrgirl.connection.serialPort.close();
            reject(new UploadError("canceled"));
            return;
          }

          const enc = new TextEncoder();
          avrgirl.protocol.chip.verifyPage = (_a, _b, _c, _d, cb) => cb();
          avrgirl.protocol.chip.verify = (_a, _b, _c, _d, cb) => cb();

          (avrgirl as Avrgirl).flash(enc.encode(hex as string), error => {
            if (error) {
              avrgirl.connection.serialPort.reader.cancel();
              avrgirl.connection.serialPort.close();
              reject(error);
              return;
            } else {
              resolve();
            }
          });
        });
    });

    return [promise, cancel];
  }

  public destroy() {
    return undefined;
  }
}

export interface ICodeUploadOptions {
  filesRoot: string;
  onBoardNotFound?: () => void;
  onUploadError?: (error: any) => void;
  onUploadSuccess?: () => void;
}

export interface ICodeUploadResult {
  upload: (
    code: any[],
    libraries: any[],
    board: string,
    onPortOpen?: () => void
  ) => void;
  compile: (code: any[], libraries: any[], board: string) => void;
  uploadContent: React.ReactElement;
  cancel: () => void;
}

export const useCodeUpload = (options): ICodeUploadResult => {
  const {
    filesRoot,
    onBoardNotFound,
    onUploadError,
    onUploadSuccess
  } = options;
  const t = useTranslate();
  const [uploading, setUploading] = useState(false);
  const cancelRef = useRef<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [noBoard, setNoBoard] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const uploaderRef = useRef<Uploader | null>(null);

  useEffect(() => {
    uploaderRef.current = new Uploader(filesRoot);

    return () => {
      if (uploaderRef.current) {
        uploaderRef.current.destroy();
      }
    };
  }, []);

  const upload = async (
    code: any[],
    libraries: any[],
    board: string,
    onPortOpen?: () => void
  ) => {
    if (!uploaderRef.current) {
      return;
    }

    setUploading(true);
    setNoBoard(false);
    setUploadSuccess(false);
    setUploadText(t("code.uploading-to-board"));

    try {
      const [uploadPromise, uploadCancel] = uploaderRef.current.upload(
        code,
        libraries,
        board,
        onPortOpen
      );
      cancelRef.current = uploadCancel;
      const hex = await uploadPromise;
      setUploading(false);
      setUploadSuccess(true);
      setUploadText(t("code.uploading-success"));
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (e) {
      setUploading(false);
      setUploadSuccess(false);

      if (e.type === "board-not-found") {
        setNoBoard(true);
        setUploadText(t("code.board-not-found"));
        if (onBoardNotFound) {
          onBoardNotFound();
        }
      } else if (e.type === "compile-error") {
        setUploadText(t("code.uploading-error"));
      }

      if (e.type !== "board-not-found" && onUploadError) {
        onUploadError();
      }

      throw e;
    } finally {
      cancelRef.current = null;
    }
  };

  const cancel = () => {
    if (cancelRef.current) {
      cancelRef.current();
    }
    setUploading(false);
  };

  const compile = async (code: any[], libraries: any[], board: string) => {
    setUploading(true);
    setNoBoard(false);
    setUploadSuccess(false);
    setUploadText(t("code.compiling"));

    try {
      const hex = await uploaderRef.current!.compile(code, libraries, board);
      setUploading(false);
      setUploadSuccess(true);
      setUploadText(t("code.compile-success"));
    } catch (e) {
      setUploading(false);
      setUploadSuccess(false);

      if (e.type === "compile-error") {
        setUploadText(t("code.uploading-error"));
      }

      throw e;
    }
  };

  const uploadContent = (
    <UploadSpinner
      uploading={uploading}
      success={uploadSuccess}
      noBoard={noBoard}
      closeOnNoBoard={true}
      text={uploadText}
    />
  );

  return { upload, compile, uploadContent, cancel };
};

export default useCodeUpload;
