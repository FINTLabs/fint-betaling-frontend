import {
  Modal,
  FileUpload,
  Button,
  VStack,
  Box,
  Heading,
} from "@navikt/ds-react";
import { useState } from "react";

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export function FileUploadModal({
  open,
  onClose,
  onFileSelect,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: any[]) => {
    // Only take the first file since multiple is false
    // Extract the actual File object from FileObject
    if (files.length > 0) {
      const fileObject = files[0];
      const file = fileObject.file || fileObject;
      if (file instanceof File) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
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
        <VStack gap="6">
          <Box>
            <p style={{ margin: 0, marginBottom: "0.5rem" }}>
              Du kan laste opp en fil med mottakere som skal legges til listen.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "var(--a-text-subtle)",
              }}
            >
              Filen må være i CSV, XLSX eller XLS-format.
            </p>
          </Box>

          <FileUpload.Dropzone
            label="Dra fil hit eller klikk for å velge"
            description="Kun CSV, XLSX eller XLS-filer er tillatt."
            accept=".csv,.xlsx,.xls"
            multiple={false}
            onSelect={handleFileSelect}
          />

          {selectedFile && (
            <Box
              padding="4"
              background="surface-subtle"
              borderRadius="medium"
              borderWidth="1"
              borderColor="border-subtle"
            >
              <VStack gap="2">
                <Heading size="xsmall" level="5" spacing>
                  Valgt fil
                </Heading>
                <Box>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {selectedFile.name}
                  </p>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      fontSize: "0.875rem",
                      color: "var(--a-text-subtle)",
                    }}
                  >
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Avbryt
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Last opp fil
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
