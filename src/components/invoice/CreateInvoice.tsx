"use client";

import { useEffect, useState } from "react";
import { FileText, UserPlus } from "lucide-react";
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

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  topLevelId: string;
  name: string;
  description: string;
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
    { client: Client; topLevelId: string; name: string; description: string }[]
  >([]);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getClints(); // Assuming this fetches the API response
        console.log(response, "API response");

        // Check if response is an array and has valid client objects
        if (Array.isArray(response) && response.length > 0) {
          // Map through response and extract the clients and top-level id
          const clientData = response.map((item: any) => ({
            client: item.clients,
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

  // Filter clients based on the search term
  const filteredClients = clients.filter(
    ({ client }) =>
      client.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-4/12">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          className="w-5/6"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {/* <Button size="icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <Search className="h-4 w-4" />
        </Button> */}
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredClients.map(({ client, topLevelId, name, description }) => (
            <div
              key={client.id}
              className="p-2 hover:bg-accent cursor-pointer"
              onClick={() => {
                onSelectClient({ ...client, topLevelId, name, description }); // Pass both client and topLevelId
                setIsDropdownOpen(false);
                setSearchTerm("");
              }}
            >
              <div className="font-medium">
                {client.firstName} {client.lastName}
              </div>
              {/* <div className="text-sm text-muted-foreground">
                Client ID: {client.id} | Job ID: {topLevelId}
              </div> */}
              <div className="text-sm text-muted-foreground">
                Email: {client.email}
              </div>
              <div className="text-sm text-muted-foreground">
                Job Name: {name}
              </div>
              <div className="text-sm text-muted-foreground">
                Job Description {description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ClientInfo Component
const ClientInfo = ({ client,name, description }: { client: Client | null; description:string; name:string; }) => {
  if (!client) return null;

  return (
    <div className="p-2 bg-muted rounded-md">
      <div className="font-medium">{client.firstName}</div>
      <div className="text-sm text-muted-foreground">{client.lastName}</div>
      <div className="text-sm text-muted-foreground">Job Name: {client.name}</div>
      <div className="text-sm text-muted-foreground">
        Job Description {client.description}
      </div>
      {/* <div className="text-sm text-muted-foreground">{client.id}</div> */}
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
    { icon: <Edit className="w-5 h-5" />, label: "View" },
    { icon: <Send className="w-5 h-5" />, label: "Send Invoice" },
  ];
  return (
    <div className="w-full flex items-center justify-between mb-8 px-4 bg-white">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center w-full">
          {/* Icon and Text next to each other */}
          <div className="flex items-center space-x-2">
            {/* Icon */}
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
            {/* Text Label */}
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

          {/* Line between icons */}
          {i < totalSteps - 1 && (
            <div
              className={`flex-grow h-[2px] mx-4 ${
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
    <Card>
      <CardHeader>
        <CardTitle>Select or Search Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientSearch onSelectClient={onSelectClient} />
        {selectedClient && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Client:</h3>
            <ClientInfo client={selectedClient} description={""} name={""} />
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
      <Card className="">
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
    <Card>
      <CardHeader>
        <CardTitle>View and Edit Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} description={""} name={""} />
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
      <CardFooter className="flex justify-between">
        <div>
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
        <div>
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
  const [message, setMessage]= useState("")
  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} description={""} name={""} />
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

              onChange={(e)=>setMessage(e.target.value)}
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
  // const [selectedClient, setSelectedClient] = useState<Client[]>([]);
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
  const totalSteps = 4;

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleDelete = () => {
    // In a real application, you would delete the invoice from your backend here
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
    setCurrentStep(2); // Go back to create invoice step
  };
  const { data: session } = useSession();
  const handleSubmit = async () => {
    try {
      // Gather necessary data to submit
      const data = {
        clientId: selectedClient?.id,
        companyId: session?.user?.companyId,
        createdBy: session?.user?.userId,
        totalAmount: invoice.amount,
        subTotal: invoice.subTotal || invoice.amount,
        tax: invoice.tax || 0,
        dueDate: invoice.dueDate,
        notes: invoice.description || "No additional notes.",
        jobId: selectedClient?.topLevelId, // Use topLevelId as jobId
      };

      // Basic validation
      if (!data.companyId || !data.totalAmount || !data.dueDate) {
        toast.error("Please fill in all required fields."); // Use toast for error
        return;
      }

      console.log(data, "sending data api");

      // Send the POST request to the API endpoint
      const response = await fetch(baseUrl + `invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Invoice sent successfully!"); // Success toast
        router.push("/callpro/invoice"); // Adjust the path as needed
        revalidateTag("getclient");

        // Optionally handle result data
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData); // Log for debugging
        const errorMessages = Array.isArray(errorData.error)
          ? errorData.error.join(", ")
          : "Unknown error occurred.";
        toast.error(`Failed to send invoice: ${errorMessages}`); // Use toast for error
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("An error occurred while sending the invoice."); // Use toast for error
    }
  };

  return (
    <div className="container mx-auto py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 pl-20px">Create Invoice</h1>
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
