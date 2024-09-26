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



const mockFetchInvoices = async (): Promise<Invoice[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      _id: '1',
      jobId: 'JOB001',
      clientId: 'CLIENT001',
      items: [{ description: 'Service', quantity: 1, unitPrice: 100, total: 100 }],
      subtotal: 100,
      tax: 10,
      totalAmount: 110,
      paymentStatus: 'paid',
      dueDate: '2023-07-01',
      issueDate: '2023-06-01',
      status: 'completed',
      createdAt: '2023-06-01',
      updatedAt: '2023-06-01',
    },
    {
      _id: '2',
      jobId: 'JOB002',
      clientId: 'CLIENT002',
      items: [{ description: 'Product', quantity: 2, unitPrice: 50, total: 100 }],
      subtotal: 100,
      tax: 10,
      totalAmount: 110,
      paymentStatus: 'pending',
      dueDate: '2023-07-15',
      issueDate: '2023-06-15',
      status: 'sent',
      createdAt: '2023-06-15',
      updatedAt: '2023-06-15',
    },
    // Add more mock invoices as needed
  ];
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

export default function EnhancedInvoiceManager() {
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

  //session
  const { data: session } = useSession()


  useEffect(() => {
    fetchInvoices();
    fetchDashboardMetrics();
  }, []);

  const fetchInvoices = async () => {
    try {
      const invoices = await mockFetchInvoices();
      setAllInvoices(invoices);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  // const handleCreate = async () => {
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
          <DataTable columns={InvoiceColumns} data={allInvoices} />
          {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInvoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell>{inv._id}</TableCell>
                  <TableCell>{inv.clientId}</TableCell>
                  <TableCell>${inv.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'completed' ? 'default' : 'secondary'}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(inv.dueDate), 'PP')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setInvoice(inv)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
        </CardContent>
      </Card>

      {/* Selected Invoice Details */}
     
    </div>
  )
}