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
import { DownloadIcon, Loader, UploadIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Revalidate } from "@/utils/Revalidate"
import { useSession } from "next-auth/react"
import { BulkCustomerCreation } from "./CustomerActions"

export default function BulkCustomerImport() {
  const [file, setFile] = useState<File | null>(null)


  const { data: session } = useSession()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    console.log(selectedFile?.type)
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile)
    } else {
      toast.error("Please select a valid excel file.")
      event.target.value = ""
    }
  }

  const handleDownloadTemplate = () => {
    // Directly referencing the template stored in the public folder
    const url = "/customertemplate.xlsx" // Path to the CSV template in the public folder
    const a = document.createElement("a")
    a.href = url
    a.download = "customers_template.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleUpload = () => {
    if (file) {
      const uploadeddata = new FormData(); // No need to specify FormData type explicitly
      uploadeddata.append("companyId", session?.user?.companyId ?? "");
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
    mutationFn: async (values: FormData) => {
      return await BulkCustomerCreation(values)
    },
    onSuccess(data, variables, context) {
        if(data && data[0] === 200){
            toast.success("customers created successful")
            Revalidate("getcustomers")
            Revalidate("getcustomersinfo")
          }else{
            toast.error((data && data[1]) ?? "")
          }
    },
    onError(error, variables, context) {
      toast.error("error in creating customers")
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 border border-primary800 text-primary600 hover:bg-primary400 hover:text-white transition-all duration-300">Bulk Import</Button>
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
          <Button onClick={handleUpload} className="w-full" disabled={uploadmutation.isPending}>
            <UploadIcon className="mr-2 h-4 w-4" />
            {uploadmutation.isPending ? <Loader className="animate animate-spin text-white" /> : "Upload"}

          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
