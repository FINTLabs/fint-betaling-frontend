import {
  Button,
  type FileObject,
  // type FilesPartitioned,
  FileUpload,
  Modal,
  VStack,
} from "@navikt/ds-react";
import { useState } from "react";

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}

const ACCEPTED_FILE_TYPES = [".csv", ".xlsx", ".xls"];
const ACCEPTED_MIME_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

// Validator function for FileUpload.Dropzone
const fileValidator = (file: File): true | string => {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));

  // Check if file extension is in accepted list
  const isValidExtension = ACCEPTED_FILE_TYPES.some(
    (type) => type.toLowerCase() === fileExtension,
  );

  // Also check MIME type as a fallback
  const isValidMimeType =
    ACCEPTED_MIME_TYPES.includes(file.type) || file.type === "";

  if (!isValidExtension && !isValidMimeType) {
    return "Filformatet støttes ikke";
  }

  return true;
};

export function FileUploadModal({
  open,
  onClose,
  onFileUpload,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<FileObject[]>([]);

  const handleFileSelect = (
    selectedFiles: FileObject[],
    // partitionedFiles: FilesPartitioned,
  ) => {
    setFiles(selectedFiles);

    // If there are accepted files, call the onFileSelect callback
    // if (partitionedFiles.accepted.length > 0) {
    //   onFileSelect(partitionedFiles.accepted[0]);
    // }
  };

  const handleFileUpload = () => {
    if (files.length > 0) {
      onFileUpload(files[0].file);
      onClose();
    }
  };

  const handleCancel = () => {
    setFiles([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      header={{
        heading: "Last opp fil med mottakere",
      }}
      width="medium"
    >
      <Modal.Body>
        <VStack gap="space-24">
          <FileUpload.Dropzone
            label="Last opp fødselsattest"
            fileLimit={{ max: 1, current: files.length }}
            multiple={false}
            onSelect={handleFileSelect}
            accept={".csv,.xlsx,.xls"}
            validator={fileValidator}
          />
          {files.map((file) => (
            <FileUpload.Item
              key={file.file.name}
              file={file.file}
              button={{
                action: "delete",
                onClick: () => setFiles([]),
              }}
              error={file.error ? file.reasons[0] : undefined}
            />
          ))}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Avbryt
        </Button>
        <Button
          variant="primary"
          onClick={handleFileUpload}
          disabled={!files.length}
        >
          Last opp fil
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
