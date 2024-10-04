"use client"
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { toast } from "@/shadcn/ui/use-toast"
import { Printer, Mail, Share2, Pencil, Trash, Download, Plus, DollarSign, FileText, Clock, Calendar } from 'lucide-react'
import router from 'next/router'
import { useRouter } from 'next/navigation'
import { DataTable } from './data-table'
import InvoiceColumns from './InvoiceColumns'
import { useSession } from 'next-auth/react'
interface Client {
  firstName: string;
  lastName: string;
}

interface Invoice {
  id: string;
  client: Client;
  job: string | null; // Assuming job can be a string or null
  type: string;
  status: string;
  dueDate: string; // Consider using Date if you want to work with dates in a more structured way
  issueDate: string; // Same as above
  totalAmount: number;
}

interface InvoicesResponse {
  message: string;
  invoices: Invoice[];
}


// Mock functions for backend operations
const mockCreateInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    _id: Math.random().toString(36).substr(2, 9),
    ...invoice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Invoice;
}




const mockFetchDashboardMetrics = async (): Promise<{
  overdueAmount: number;
  draftTotal: number;
  unpaidTotal: number;
  averagePaidTime: number;
  invoicesDueToday: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    overdueAmount: 500,
    draftTotal: 1000,
    unpaidTotal: 2000,
    averagePaidTime: 15,
    invoicesDueToday: 3,
  };
}

export default function EnhancedInvoiceManager({getInvoice}:{getInvoice:any}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    overdueAmount: 0,
    draftTotal: 0,
    unpaidTotal: 0,
    averagePaidTime: 0,
    invoicesDueToday: 0,
  });


  const router = useRouter();

  // console.log(getInvoice, "----------------getInvoice server page client-----------------------");
  

  //session
  const { data: session } = useSession()


  useEffect(() => {
    fetchDashboardMetrics();
  }, []);



  const fetchDashboardMetrics = async () => {
    try {
      const metrics = await mockFetchDashboardMetrics();
      setDashboardMetrics(metrics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard metrics. Please try again.",
        variant: "destructive",
      });
    }
  };

  //   setIsCreating(true);
  //   try {
  //     const newInvoice = await mockCreateInvoice({
  //       jobId: '',
  //       clientId: '',
  //       items: [],
  //       subtotal: 0,
  //       tax: 0,
  //       totalAmount: 0,
  //       paymentStatus: 'pending',
  //       dueDate: new Date().toISOString(),
  //       issueDate: new Date().toISOString(),
  //       status: 'draft',
  //     });
  //     setInvoice(newInvoice);
  //     setIsEditing(true);
  //     toast({
  //       title: "Invoice Created",
  //       description: "A new invoice has been created and is ready for editing.",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to create invoice. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Assuming you have a page for creating invoices
      router.push('/callpro/createinvoice'); // Redirect to the new invoice creation page
      toast({
        title: "Redirecting",
        description: "Redirecting to the new invoice creation page.",
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
 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Invoice Manager</h1>
      
      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.overdueAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.draftTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.unpaidTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Paid Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.averagePaidTime} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.invoicesDueToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Invoice Button */}
      {session?.user.role === "business owner" ||  session?.user.role === "business admin" ?(
        <div className="mb-6">
        <Button onClick={handleCreate} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" /> Create New Invoice
        </Button>
      </div>

      ) : null }
      
      {/* All Invoices Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={InvoiceColumns} data={getInvoice?.invoices || []} />
          
        </CardContent>
      </Card>

      {/* Selected Invoice Details */}
     
    </div>
  )
}