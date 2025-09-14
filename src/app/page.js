"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [file, setFile] = useState(null);
  const [showPasteAlert, setShowPasteAlert] = useState(false);

  function handleDrop(acceptedFiles) {
    console.log(`Filename: ${acceptedFiles[0].name}`);
    setFile(acceptedFiles[0]);
  }

  function handlePaste(event) {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        console.log(`Pasted file: ${blob.name || "image.png"}`);
        setFile(blob);
        setShowPasteAlert(true);
        setTimeout(() => setShowPasteAlert(false), 3000);
        break;
      }
    }
  }

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);
  return (
    <div className="min-h-screen flex items-start justify-between px-4 sm:px-6 lg:px-8">
      {showPasteAlert && (
        <Alert className="fixed top-4 right-4 w-auto z-50 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Image pasted successfully!
          </AlertDescription>
        </Alert>
      )}
      <div className="flex-col flex-1">
        <div className="mt-12 md:mt-24 sm:ml-6 md:ml-16 lg:ml-32">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold  ">
            FreeOCR
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-sans italic">
            OCR without bullshit.
          </h2>
        </div>

        <div className="w-full flex flex-row items-start gap-x-8">
          <div className="sm:ml-6 md:ml-16 lg:ml-32 mt-4">
            <Dropzone
              accept={{ "image/*": [] }}
              maxFiles={1}
              onDrop={handleDrop}
              className={
                "w-32 h-32 sm:w-32 sm:h-32 md:w-64 md:h-64 lg:w-80 border-2 border-dashed rounded-lg flex items-center justify-center p-4 cursor-pointer"
              }
            >
              <DropzoneContent>
                {file ? (
                  <>
                    <p>File: {file.name}</p>
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                  </>
                ) : (
                  <DropzoneEmptyState>
                    <p className="text-center break-words whitespace-normal">
                      Drag and drop an image file here, paste it, or click to
                      select one.
                    </p>
                  </DropzoneEmptyState>
                )}
              </DropzoneContent>
            </Dropzone>
          </div>

          <div className="ml-auto sm:mr-6 md:mr-16 lg:mr-32 flex flex-col items-center mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Detect</SelectItem>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="por">Portuguese</SelectItem>
                <SelectItem value="spa">Spanish</SelectItem>
                <SelectItem value="fra">French</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mt-4">Extract Text</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
