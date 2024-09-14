"use client"

import { useState } from "react"
import { Button } from "@/shadcn/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { DownloadIcon, UploadIcon } from "lucide-react"

export default function BulkImportButton() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    } else {
      alert("Please select a valid CSV file.")
      event.target.value = ""
    }
  }

  const handleDownloadTemplate = () => {
    // Directly referencing the template stored in the public folder
    const url = "/import_template.csv" // Path to the CSV template in the public folder
    const a = document.createElement("a")
    a.href = url
    a.download = "import_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleUpload = () => {
    if (file) {
      // Simulating file upload
      console.log(`Uploading file: ${file.name}`)
      // Here you would typically send the file to your server
      alert("File uploaded successfully!")
      setFile(null)
    } else {
      alert("Please select a file to upload.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Import</DialogTitle>
          <DialogDescription>
            Download the template, fill it with your data, and upload the CSV file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            // variant="secondary"
            onClick={handleDownloadTemplate}
            className="w-full bg-green-800 hover:bg-green-600"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="csv-upload">Upload CSV</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <Button onClick={handleUpload} className="w-full">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
