import { useState, ChangeEvent } from "react";

import { Button } from "primereact/button";
import { API_BASE_URL } from "../client/config";

const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{ filePath: string } | null>(
    null
  );

  // Handle file selection
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const onFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const reqErr = await res.json();
        throw new Error(reqErr.message);
      }

      const data = await res.json();
      const { filePath } = data;
      setUploadedFile({ filePath });
      setMessage("File uploaded successfully");
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error uploading file: ${err}`);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={onFileUpload}>
        <input title="file" type="file" onChange={onFileChange} />
        <Button type="submit" icon="pi pi-check" rounded />
      </form>
      {message && <p>{message}</p>}
      {uploadedFile && (
        <div>
          <h4>Uploaded File:</h4>
          <a
            href={`${API_BASE_URL}${uploadedFile.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
