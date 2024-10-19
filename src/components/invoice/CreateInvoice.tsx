"use client";

import { useEffect, useState } from "react";
import { FileOutput, FileText, UserPlus } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Check,
  ChevronRight,
  Search,
  Trash2,
  Edit,
  Send,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { baseUrl } from "@/utils/constants";
import { getCustomers } from "../Customer/CustomerActions";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getClints } from "./ServerActions";
import { searchNumbers } from "libphonenumber-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { revalidateTag } from "next/cache";
import { Revalidate } from "@/utils/Revalidate";
import jsPDF from "jspdf";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  topLevelId: string;
  name: string;
  description: string;
  Jobstatus: string;
}

interface Data {
  id: string; // Top-level ID
  clients: Client;
}

// Validation schema using Yup
const invoiceSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .min(0, "Amount must be positive")
    .required("Amount is required"),
  subtotal: Yup.number()
    .min(0, "Subtotal must be positive")
    .required("Subtotal is required"),
  tax: Yup.number().min(0, "Tax must be positive").required("Tax is required"),
  dueDate: Yup.date().required("Due date is required"),
});

// ClientSearch component
const ClientSearch = ({ onSelectClient }: { onSelectClient: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clients, setClients] = useState<
    {
      client: Client;
      topLevelId: string;
      Jobstatus: string;
      name: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getClints();
        console.log(response, "API response");

        if (Array.isArray(response) && response.length > 0) {
          const clientData = response.map((item: any) => ({
            client: item.clients,
            Jobstatus: item.status,
            topLevelId: item.id,
            name: item.name,
            description: item.description,
          }));
          setClients(clientData);
        } else {
          console.error("Invalid response format: ", response);
        }
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredClients = clients.filter(
    ({ client }) =>
      client.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full md:w-4/12">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          className="w-full md:w-30"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredClients.map(
            ({ client, topLevelId, Jobstatus, name, description }) => (
              <div
                key={client.id}
                className="p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  onSelectClient({ ...client, topLevelId,Jobstatus, name, description });
                  setIsDropdownOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="font-medium">
                  {client.firstName} {client.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Email: {client.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  Job Name: {name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Job Description {description}
                </div>
                <div className="text-sm text-muted-foreground">
                  Job Status {Jobstatus}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ClientInfo Component
const ClientInfo = ({
  client,
  name,
  description,
  Jobstatus,
}: {
  client: Client | null;
  description: string;
  name: string;
  Jobstatus: string;
}) => {
  if (!client) return null;

  return (
    <div className="p-2 bg-muted rounded-md">
      <div className="font-medium">{client.firstName}</div>
      <div className="text-sm text-muted-foreground">{client.lastName}</div>
      <div className="text-sm text-muted-foreground">
        Job Name: {client.name}
      </div>
      <div className="text-sm text-muted-foreground">
        Job Description {client.description}
      </div>
      <div className="text-sm text-muted-foreground">
        Job Status {client.Jobstatus}
      </div>
    </div>
  );
};

// Stepper component
const Stepper = ({
  currentStep,
  totalSteps,
}: {
  currentStep: any;
  totalSteps: any;
}) => {
  const stepIcons = [
    { icon: <UserPlus className="w-5 h-5" />, label: "Select Client" },
    { icon: <FileText className="w-5 h-5" />, label: "Create Invoice" },
    { icon: <Edit className="w-5 h-5" />, label: "View/Edit" },
    { icon: <FileOutput className="w-5 h-5" />, label: "View PDF" },
    { icon: <Send className="w-5 h-5" />, label: "Send Invoice" },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8 px-4 bg-white">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center w-full mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                i <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-muted text-muted-foreground"
              }`}
            >
              {i < currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                stepIcons[i].icon
              )}
            </div>
            <p
              className={`text-black ${
                i <= currentStep
                  ? "font-semibold text-black"
                  : "font-normal text-black"
              }`}
            >
              {stepIcons[i].label}
            </p>
          </div>

          {i < totalSteps - 1 && (
            <div
              className={`hidden md:block flex-grow h-[2px] mx-4 ${
                i < currentStep - 1 ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Step 1: Select or search client
const SelectClientStep = ({
  onNext,
  selectedClient,
  onSelectClient,
}: {
  onNext: any;
  selectedClient: any;
  onSelectClient: any;
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select or Search Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientSearch onSelectClient={onSelectClient} />
        {selectedClient && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Client:</h3>
            <ClientInfo client={selectedClient} description={""} name={""} Jobstatus={""} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} disabled={!selectedClient}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Step 2: Create invoice
const CreateInvoiceStep = ({
  onNext,
  onPrev,
  selectedClient,
  invoice,
  setInvoice,
}: {
  onNext: any;
  onPrev: any;
  selectedClient: any;
  invoice: any;
  setInvoice: any;
}) => {
  const formik = useFormik({
    initialValues: {
      description: invoice.description || "",
      amount: invoice.amount || "",
      subtotal: invoice.subtotal || "",
      tax: invoice.tax || "",
      dueDate: invoice.dueDate || "",
    },
    validationSchema: invoiceSchema,
    onSubmit: (values) => {
      setInvoice(values);
      onNext();
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Invoice description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.description && formik.touched.description
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.description as string}
                </div>
              ) : null}
            </div>

            <div>
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.amount && formik.touched.amount
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.errors.amount && formik.touched.amount ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.amount as string}
                </div>
              ) : null}
            </div>
            <div>
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                placeholder="0.00"
                value={formik.values.subtotal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.subtotal && formik.touched.subtotal
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.errors.subtotal && formik.touched.subtotal ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.subtotal as string}
                </div>
              ) : null}
            </div>
            <div>
              <Label htmlFor="tax">Tax</Label>
              <Input
                id="tax"
                type="number"
                placeholder="0.00"
                value={formik.values.tax}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.tax && formik.touched.tax
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.errors.tax && formik.touched.tax ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.tax as string}
                </div>
              ) : null}
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.dueDate && formik.touched.dueDate
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.errors.dueDate && formik.touched.dueDate ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.dueDate as string}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button type="submit">Next</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

// Step 3: View and edit invoice
const ViewEditInvoiceStep = ({
  onNext,
  onPrev,
  selectedClient,
  invoice,
  setInvoice,
  onDelete,
}: {
  onNext: any;
  onPrev: any;
  selectedClient: any;
  invoice: any;
  setInvoice: any;
  onDelete: any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(invoice);

  const handleSave = () => {
    setInvoice(editedInvoice);
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>View and Edit Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} description={""} name={""} Jobstatus={""} />
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editedInvoice.description}
                  onChange={(e) =>
                    setEditedInvoice({
                      ...editedInvoice,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editedInvoice.amount}
                  onChange={(e) =>
                    setEditedInvoice({
                      ...editedInvoice,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-subtotal">SubTotal</Label>
                <Input
                  id="edit-subtotal"
                  type="number"
                  value={editedInvoice.subtotal}
                  onChange={(e) =>
                    setEditedInvoice({
                      ...editedInvoice,
                      subtotal: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-tax">Tax</Label>
                <Input
                  id="edit-tax"
                  type="number"
                  value={editedInvoice.tax}
                  onChange={(e) =>
                    setEditedInvoice({
                      ...editedInvoice,
                      tax: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editedInvoice.dueDate}
                  onChange={(e) =>
                    setEditedInvoice({
                      ...editedInvoice,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {invoice.description}
                </p>
              </div>
              <div>
                <Label>Total Amount</Label>
                <p className="text-sm text-muted-foreground">
                  ${invoice.amount}
                </p>
              </div>
              <div>
                <Label>SubTotal</Label>
                <p className="text-sm text-muted-foreground">
                  ${invoice.subtotal}
                </p>
              </div>{" "}
              <div>
                <Label>Tax</Label>
                <p className="text-sm text-muted-foreground">${invoice.tax}</p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="text-sm text-muted-foreground">
                  {invoice.dueDate}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row justify-between">
        <div className=" grid grid-cols-2 mb-4 md:mb-0">
          <Button variant="outline" className="mr-2" onClick={onPrev}>
            Previous
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this invoice?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  invoice.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="grid grid-cols-2">
          {isEditing ? (
            <Button onClick={handleSave} className="mr-2">
              Save
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="mr-2">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
          <Button onClick={onNext}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// New Step 4: View Invoice as PDF
const ViewPDFInvoiceStep = ({
  onNext,
  onPrev,
  selectedClient,
  invoice,
}: {
  onNext: any;
  onPrev: any;
  selectedClient: any;
  invoice: any;
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePDF = () => {
      const doc = new jsPDF();

      // Add content to the PDF

      // Title - Dispatch Rhino Invoice
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40); // Dark Grey for title
      doc.text("DISPATCH RHINO INVOICE", 105, 20, { align: "center" });

      // Add a horizontal separator below the title
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);

      // Invoice Header - Client & Invoice Information Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204); // Blue color for headings
      doc.text("Client Information", 20, 35);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Default Black color
      doc.text(
        `Client: ${selectedClient.firstName} ${selectedClient.lastName}`,
        20,
        45
      );
      doc.text(`Email: ${selectedClient.email}`, 20, 55);

      // Invoice Information
      const today = new Date().toLocaleDateString(); // Current date
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.text("Invoice Information", 130, 35);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`JobID #: ${selectedClient.topLevelId}`, 130, 45);
      doc.text(`Invoice Date: ${today}`, 130, 55);

      // Job Scheduling Information (Table Layout)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.text("Job Scheduling Details", 20, 75);

      // Table Headers
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White for table header text
      doc.setFillColor(0, 102, 204); // Blue background for headers
      doc.rect(20, 85, 170, 10, "F"); // Fill header background

      doc.text(" Job Description", 25, 92);
      // doc.text("Job ID", 60, 92);
      doc.text("Job Name", 110, 92);
      doc.text("Status", 160, 92);

      // Table Data (Rows)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Default Black for row text
      doc.rect(20, 95, 170, 10); // Row 1 border
      doc.text(`${selectedClient.description}`, 25, 102);
      // doc.text(`${selectedClient.topLevelId}`, 60, 102);
      doc.text(`${selectedClient.name}`, 110, 102);
      doc.text(`${selectedClient.Jobstatus}`, 160, 102);

      // Invoice Breakdown Section (Table Layout)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204); // Blue for headers
      doc.text("Invoice Breakdown", 20, 120);

      // Table Headers for Breakdown
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White for table header text
      doc.setFillColor(0, 102, 204); // Blue background for headers
      doc.rect(20, 130, 170, 10, "F"); // Fill header background

      doc.text("Description", 25, 137);
      doc.text("Amount", 160, 137);

      // Table Data (Rows)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Default Black for row text
      doc.rect(20, 140, 170, 10); // Row 1 border
      doc.text("Subtotal", 25, 147);
      doc.text(`$${invoice.subtotal}`, 160, 147, { align: "right" });

      doc.rect(20, 150, 170, 10); // Row 2 border
      doc.text("Tax", 25, 157);
      doc.text(`$${invoice.tax}`, 160, 157, { align: "right" });

      doc.rect(20, 160, 170, 10); // Row 3 border
      doc.text("Total Amount Due", 25, 167);
      doc.text(`$${invoice.amount}`, 160, 167, { align: "right" });

      // Total Amount with Highlight (separate from table)
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White for total text
      doc.setFillColor(255, 0, 0); // Red background for total
      doc.roundedRect(20, 175, 170, 20, 3, 3, "F");
      doc.text("TOTAL DUE", 25, 190);
      doc.text(`$${invoice.amount}`, 160, 190, { align: "right" });

      // Footer with Branding and Contact Information
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100); // Grey for footer text
      doc.text("Thank you for choosing Dispatch Rhino!", 105, 210, {
        align: "center",
      });
      doc.text(
        "Dispatch Rhino | www.dispatchrhino.com | Phone: (123) 456-7890",
        105,
        220,
        { align: "center" }
      );

      // Generate PDF blob and create URL
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    };

    generatePDF();

    // Cleanup function to revoke the URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [selectedClient, invoice]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>View Invoice PDF</CardTitle>
      </CardHeader>
      <CardContent>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="Invoice PDF"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Step 4: Send invoice
const SendInvoiceStep = ({
  onPrev,
  selectedClient,
  invoice,
  handleSubmit,
}: {
  onPrev: any;
  selectedClient: any;
  invoice: any;
  handleSubmit: any;
}) => {
  const [message, setMessage] = useState("");
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Send Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} description={""} name={""} Jobstatus={""} />
          <div>
            <Label htmlFor="email">Client Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={selectedClient?.email}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              defaultValue={invoice.description}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message for your client..."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          <Send className="mr-2 h-4 w-4" /> Send Invoice
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main component
export default function InvoiceCreationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter();

  const [invoice, setInvoice] = useState({
    description: "",
    amount: "",
    clientId: "",
    dueDate: "",
    tax: "",
    subTotal: "",
    id: "",
    notes: "",
  });
  const totalSteps = 5;

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleDelete = () => {
    setInvoice({
      description: "",
      id: "",
      notes: "",
      amount: "",
      subTotal: "",
      tax: "",
      dueDate: "",
      clientId: "",
    });
    setCurrentStep(2);
  };
  const { data: session } = useSession();
  const handleSubmit = async () => {
    try {
      const data = {
        clientId: selectedClient?.id,
        companyId: session?.user?.companyId,
        createdBy: session?.user?.userId,
        totalAmount: invoice.amount,
        subTotal: invoice.subTotal || invoice.amount,
        tax: invoice.tax || 0,
        dueDate: invoice.dueDate,
        notes: invoice.description || "No additional notes.",
        jobId: selectedClient?.topLevelId,
      };

      if (!data.companyId || !data.totalAmount || !data.dueDate) {
        toast.error("Please fill in all required fields.");
        return;
      }

      console.log(data, "sending data api");

      const response = await fetch(baseUrl + `invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: JSON.stringify(data),
      });
      console.log(response.status, "invoice status");

      if (response.status === 201) {
        const result = await response.json();
        toast.success("Invoice sent successfully!");
        router.push("/callpro/invoice");
        Revalidate("getclient");
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        const errorMessages = Array.isArray(errorData.error)
          ? errorData.error.join(", ")
          : "Unknown error occurred.";
        toast.error(`Failed to send invoice: ${errorMessages}`);
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("An error occurred while sending the invoice.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      {currentStep === 1 && (
        <SelectClientStep
          onNext={nextStep}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
        />
      )}
      {currentStep === 2 && (
        <CreateInvoiceStep
          onNext={nextStep}
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
          setInvoice={setInvoice}
        />
      )}
      {currentStep === 3 && (
        <ViewEditInvoiceStep
          onNext={nextStep}
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
          setInvoice={setInvoice}
          onDelete={handleDelete}
        />
      )}
      {currentStep === 4 && (
        <ViewPDFInvoiceStep
          onNext={nextStep}
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
        />
      )}
      {currentStep === 5 && (
        <SendInvoiceStep
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
