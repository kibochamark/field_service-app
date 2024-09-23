"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { toast } from "@/shadcn/ui/use-toast";

interface Client {
  id: string;
  name: string;
}
import {
  Printer,
  Mail,
  Share2,
  Pencil,
  Trash,
  Download,
  Plus,
} from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  _id: string;
  jobId: string;
  clientId: string;
  technicianId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: string;
  dueDate: string;
  issueDate: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock functions for backend operations
const mockCreateInvoice = async (
  invoice: Partial<Invoice>
): Promise<Invoice> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    _id: Math.random().toString(36).substr(2, 9),
    ...invoice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Invoice;
};

const mockUpdateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
};

const mockDeleteInvoice = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const mockSendEmail = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const mockShareInvoice = async (id: string): Promise<string> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `https://example.com/share/${id}`;
};

const mockDownloadPdf = async (id: string): Promise<Blob> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Blob(["PDF content"], { type: "application/pdf" });
};

const mockGetClients = async (): Promise<Client[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { id: "1", name: "Client A" },
      { id: "2", name: "Client B" },
      { id: "3", name: "Client C" },
    ]; // Mock client data
  };

export default function InvoiceManager() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
 




  // Fetch clients when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await mockGetClients();
      setClients(fetchedClients);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (!invoice) {
      handleCreate();
    }
  }, [invoice]);
  

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newInvoice = await mockCreateInvoice({
        jobId: "",
        clientId: "",
        items: [],
        subtotal: 0,
        tax: 0,
        totalAmount: 0,
        paymentStatus: "pending",
        dueDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        status: "draft",
      });
      setInvoice(newInvoice);
      setIsEditing(true);
      toast({
        title: "Invoice Created",
        description: "A new invoice has been created and is ready for editing.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!invoice) return;
    try {
      const updatedInvoice = await mockUpdateInvoice(invoice);
      setInvoice(updatedInvoice);
      setIsEditing(false);
      toast({
        title: "Invoice Updated",
        description: "The invoice has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await mockDeleteInvoice(invoice._id);
        setInvoice(null);
        toast({
          title: "Invoice Deleted",
          description: "The invoice has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete invoice. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendEmail = async () => {
    try {
      // Replace this with your email sending logic
      await sendEmail(recipientEmail, emailMessage); // Implement this function

      setSuccessMessage("Invoice sent successfully!");
      setRecipientEmail(""); // Clear the input field
      setEmailMessage(""); // Clear the message field
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error appropriately (e.g., set an error message)
    }
  };

  const handleShare = async () => {
    if (!invoice) return;
    try {
      const shareUrl = await mockShareInvoice(invoice._id);
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Invoice Shared",
        description: "The share link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    try {
      const pdfBlob = await mockDownloadPdf(invoice._id);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `invoice-${invoice._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "PDF Downloaded",
        description: "The invoice PDF has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Invoice Manager</h1>
      <div className="mb-4">
        <select
          value={selectedClientId || ''}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="" disabled>Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      {/* {!invoice && (
        <Button onClick={handleCreate} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" /> Create New Invoice
        </Button>
      )} */}
      {invoice && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex justify-between items-center">
              Invoice
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDelete}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <div className="flex justify-between items-center">
              <div>
                <p>
                  <strong>Invoice ID:</strong> {invoice._id}
                </p>
                <p>
                  <strong>Job ID:</strong>{" "}
                  {isEditing ? (
                    <Input
                      value={invoice.jobId}
                      onChange={(e) =>
                        setInvoice({ ...invoice, jobId: e.target.value })
                      }
                    />
                  ) : (
                    invoice.jobId
                  )}
                </p>
                <p>
                  <strong>Client ID:</strong>{" "}
                  {isEditing ? (
                    <Input
                      value={invoice.clientId}
                      onChange={(e) =>
                        setInvoice({ ...invoice, clientId: e.target.value })
                      }
                    />
                  ) : (
                    invoice.clientId
                  )}
                </p>
                {invoice.technicianId && (
                  <p>
                    <strong>Technician ID:</strong>{" "}
                    {isEditing ? (
                      <Input
                        value={invoice.technicianId}
                        onChange={(e) =>
                          setInvoice({
                            ...invoice,
                            technicianId: e.target.value,
                          })
                        }
                      />
                    ) : (
                      invoice.technicianId
                    )}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p>
                  <strong>Issue Date:</strong>{" "}
                  {isEditing ? (
                    <Input
                      type="date"
                      value={invoice.issueDate.split("T")[0]}
                      onChange={(e) =>
                        setInvoice({ ...invoice, issueDate: e.target.value })
                      }
                    />
                  ) : (
                    format(new Date(invoice.issueDate), "PP")
                  )}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {isEditing ? (
                    <Input
                      type="date"
                      value={invoice.dueDate.split("T")[0]}
                      onChange={(e) =>
                        setInvoice({ ...invoice, dueDate: e.target.value })
                      }
                    />
                  ) : (
                    format(new Date(invoice.dueDate), "PP")
                  )}
                </p>
                {isEditing ? (
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      setInvoice({ ...invoice, status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                  </select>
                ) : (
                  <Badge
                    variant={
                      invoice.status === "paid" ? "default" : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...invoice.items];
                            newItems[index].description = e.target.value;
                            setInvoice({ ...invoice, items: newItems });
                          }}
                        />
                      ) : (
                        item.description
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...invoice.items];
                            newItems[index].quantity = Number(e.target.value);
                            newItems[index].total =
                              newItems[index].quantity *
                              newItems[index].unitPrice;
                            setInvoice({ ...invoice, items: newItems });
                          }}
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...invoice.items];
                            newItems[index].unitPrice = Number(e.target.value);
                            newItems[index].total =
                              newItems[index].quantity *
                              newItems[index].unitPrice;
                            setInvoice({ ...invoice, items: newItems });
                          }}
                        />
                      ) : (
                        `$${item.unitPrice.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {isEditing && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Button
                        onClick={() =>
                          setInvoice({
                            ...invoice,
                            items: [
                              ...invoice.items,
                              {
                                description: "",
                                quantity: 0,
                                unitPrice: 0,
                                total: 0,
                              },
                            ],
                          })
                        }
                      >
                        Add Item
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4 text-right">
              <p>
                <strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Tax:</strong>{" "}
                {isEditing ? (
                  <Input
                    type="number"
                    value={invoice.tax}
                    onChange={(e) =>
                      setInvoice({ ...invoice, tax: Number(e.target.value) })
                    }
                  />
                ) : (
                  `$${invoice.tax.toFixed(2)}`
                )}
              </p>
              <p className="text-xl font-bold">
                <strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}
              </p>
            </div>
            {isEditing ? (
              <Textarea
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice({ ...invoice, notes: e.target.value })
                }
                placeholder="Add notes here..."
                className="mt-4"
              />
            ) : (
              invoice.notes && (
                <div className="mt-4">
                  <strong>Notes:</strong>
                  <p>{invoice.notes}</p>
                </div>
              )
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p>
                <strong>Payment Status:</strong>{" "}
                {isEditing ? (
                  <select
                    value={invoice.paymentStatus}
                    onChange={(e) =>
                      setInvoice({ ...invoice, paymentStatus: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                ) : (
                  invoice.paymentStatus
                )}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {format(new Date(invoice.createdAt), "PP")}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {format(new Date(invoice.updatedAt), "PP")}
              </p>
            </div>
            <div className="space-x-2">
              {isEditing ? (
                <Button onClick={handleUpdate}>Save Changes</Button>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Invoice</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>
                          Enter the recipient's email address and an optional
                          message:
                        </p>
                        <Input
                          type="email"
                          placeholder="Recipient Email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                        />
                        <Textarea
                          placeholder="Optional message"
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                        />
                        <Button onClick={handleSendEmail}>Send</Button>
                        {successMessage && (
                          <p className="text-green-600">{successMessage}</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownloadPdf}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
const sendEmail = async (email, message) => {
    // Here, you would implement your email sending logic (e.g., API call)
    // For demonstration purposes, we'll just resolve the promise
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

