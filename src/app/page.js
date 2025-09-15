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
import { Check, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [language, setLanguage] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  function handleDrop(acceptedFiles) {
    console.log(`Filename: ${acceptedFiles[0].name}`);
    setFile(acceptedFiles[0]);
  }

  async function extractText() {
    setIsLoading(true);
    console.log("Extracting text...");
    if (!file) {
      setAlertMessage("Please upload an image first.");
      setShowPasteAlert(true);
      setTimeout(() => setShowPasteAlert(false), 3000);
      setTimeout(() => setIsLoading(false), 1000);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageAsBase64 = reader.result.split(",")[1]; // Remove data:image/...;base64, prefix
        let response = await fetch(
          "https://soumnerd--ocr-app-extract-text.modal.run/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image_data: imageAsBase64,
              language: language,
            }),
          }
        );
        const data = await response.json();
        setExtractedText(data.text);
        setIsLoading(false);
        //setExtractedText(`Run OCR inference on Modal by wrapping with app.function.

        // Now let's set up the actual OCR inference.

        // Using the Qapp.function decorator, set up a Modal Function. Provide arguments to the decorator to customize the hardware, scaling, and other features of the function.

        // This function uses NVIDIA L40S GPUs, retries failures up to 3 times, and has access to the shared model cache.`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  function copyToClipboard() {
    let text = extractedText;
    if (!text) {
      setAlertMessage("No text to copy.");
      setShowPasteAlert(true);
      setTimeout(() => setShowPasteAlert(false), 3000);
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
        setAlertMessage("Text copied to clipboard!");
        setShowPasteAlert(true);
        setTimeout(() => setShowPasteAlert(false), 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        setAlertMessage("Could not copy text to clipboard.");
        setShowPasteAlert(true);
        setTimeout(() => setShowPasteAlert(false), 3000);
      }
    );
  }
  function handlePaste(event) {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        console.log(`Pasted file: ${blob.name || "image.png"}`);
        setFile(blob);
        setAlertMessage("Image pasted successfully!");
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
    <div className="min-h-screen flex flex-col items-start px-4 sm:px-6 lg:px-8">
      {showPasteAlert && (
        <Alert className="fixed top-4 right-4 w-auto z-50 bg-black border-gray-700 text-white animate-in slide-in-from-right duration-300 ease-out">
          <Check className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-white ml-2">
            {alertMessage || "Image pasted successfully!"}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex-col flex-1 w-full max-w-7xl mx-auto">
        <div className="mt-12 md:mt-24 sm:ml-6 md:ml-16 lg:ml-32">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold">
            FreeOCR
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-sans italic">
            OCR without bullshit.
          </h2>
        </div>
        <div className="absolute top-12 md:top-24 right-0 sm:mr-6 md:mr-16 lg:mr-32 flex flex-col justify-start">
          <Label htmlFor="extractedText" className="mb-2">
            Extracted Text
          </Label>
          <div
            id="extractedText"
            className="w-64 sm:w-64 md:w-96 lg:w-[32rem] h-32 sm:h-32 md:h-64 lg:h-80 whitespace-pre-wrap break-words overflow-auto rounded-md border border-gray-300 text-white font-sans italic p-3 text-sm select-text"
            role="textbox"
            aria-readonly="true"
          >
            {extractedText || "The extracted text will appear here."}
          </div>
          <Button
            onClick={copyToClipboard}
            className={"mt-2 w-1/4 self-center"}
            disabled={!extractedText}
          >
            Copy
          </Button>
        </div>
        <div className="flex flex-row items-start gap-x-8 relative max-w-3xl mt-4">
          <div className="sm:ml-6 md:ml-16 lg:ml-32 flex">
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
            <div className="ml-4 flex flex-col">
              <Select onValueChange={(value) => setLanguage(value)}>
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
              <Button
                onClick={extractText}
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Extracting..." : "Extract Text"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
