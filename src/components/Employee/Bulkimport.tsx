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
import { useMutation } from "@tanstack/react-query"
import { BulkEmployeeCreation } from "./EmployeeActions"
import toast from "react-hot-toast"
import { Revalidate } from "@/utils/Revalidate"
import { useSession } from "next-auth/react"

export default function BulkImportButton() {
  const [file, setFile] = useState<File | null>(null)


  const {data:session}= useSession()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    console.log(selectedFile?.type)
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile)
    } else {
      alert("Please select a valid CSV file.")
      event.target.value = ""
    }
  }

  const handleDownloadTemplate = () => {
    // Directly referencing the template stored in the public folder
    const url = "/employeetemplate2.xlsx" // Path to the CSV template in the public folder
    const a = document.createElement("a")
    a.href = url
    a.download = "employee_template.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleUpload = () => {
    if (file) {
      const uploadeddata = new FormData(); // No need to specify FormData type explicitly
      uploadeddata.append("companyid", session?.user?.companyId ?? "");
      uploadeddata.append("file", file);
  
      // Pass the FormData directly to mutate
      uploadmutation.mutate(uploadeddata);
      setFile(null);
    } else {
      toast.error("Please select a file to upload.");
    }
  };
  

  // upload mutation
  const uploadmutation = useMutation({
    mutationFn:async(values:FormData)=>{

      return await BulkEmployeeCreation(values)
    },
    onSuccess(data, variables, context) {
      toast.success("Employees created successful")
      Revalidate("getemployees")
    },
    onError(error, variables, context) {
      toast.error("error in creating employees")
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Import</DialogTitle>
          <DialogDescription>
            Download the template, fill it with your data, and upload the excel file.
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
            <Label htmlFor="csv-upload">Upload Excel file</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
            />
          </div>
          <Button onClick={handleUpload} className="w-full">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
