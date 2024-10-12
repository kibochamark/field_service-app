"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { toast } from "react-toastify"; // For displaying success/error notifications
import { baseUrl } from "@/utils/constants";
import { useSession } from "next-auth/react"; // Import useSession for client-side session

// Yup validation schema
const validationSchema = Yup.object().shape({
  // clientId: Yup.string()
  //   .email("Invalid email format")
  //   .required("Client email is required"),
  subTotal: Yup.number().required("Subtotal is required"),
  tax: Yup.number().required("Tax is required"),
  totalAmount: Yup.number().required("Total amount is required"),
  // paymentStatus: Yup.string().required("Payment status is required"),
  dueDate: Yup.date().required("Due date is required"),
  status: Yup.string().required("Status is required"),
});

const EditInvoicePage = ({ invoiceId }: { invoiceId: string }) => {
  const [loading, setLoading] = useState(true); // To manage the loading state
  const router = useRouter();
  const { data: session } = useSession(); // Use session for client-side auth

  const [initialValues, setInitialValues] = useState({
    clientId: "",
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
    paymentStatus: "",
    dueDate: "",
    status: "draft", // Default status value
  });

  const InvoiceStatus = {
    DRAFT: "draft",
    PAID: "paid",
    OVERDUE: "overdue",
  };

  // Fetch invoice details when page loads
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (invoiceId && session) {
        const url = baseUrl + `${invoiceId}/invoice`;
        console.log("Fetching invoice from:", url);

        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: "Bearer " + session?.user?.access_token,
            },
          });
          const data = response.data.invoice[0];
          console.log(data, "Invoice data");

          // Ensure date fields are formatted properly
          setInitialValues({
            clientId: data.client?.email || "",
            subTotal: data.subTotal || 0,
            tax: data.tax || 0,
            totalAmount: data.totalAmount || 0,
            paymentStatus: data.paymentStatus || "",
            dueDate: data.dueDate
              ? new Date(data.dueDate).toISOString().split("T")[0]
              : "",
           
            status: data.status || "draft",
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching invoice data:", error);
          setLoading(false);
        }
      }
    };

    if (session) {
      fetchInvoiceData();
    }
  }, [invoiceId, session]);

  // Formik form handling
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const requestBody = {
        invoiceId,
        status: values.status,
        subTotal: values.subTotal,
        tax: values.tax,
        totalAmount: values.totalAmount,
        dueDate: values.dueDate,
      };
      console.log("Updating invoice with data:", requestBody);
      try {
        await axios.patch(
          `https://field-service-management.vercel.app/api/v1/invoice`,
          requestBody,
          {
            headers: {
              Authorization: "Bearer " + session?.user?.access_token,
            },
          }
        );
        toast.success("Invoice updated successfully!");
        router.push("/callpro/invoice");
      } catch (error) {
        toast.error("Error updating invoice.");
        console.error("Error updating invoice:", error);
      }
      
    },
  });

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is fetched
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="clientId" className="block font-medium mb-1">
            Client Email
          </label>
          <Input
            type="email"
            name="clientId"
            id="clientId"
            value={formik.values.clientId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.clientId && formik.errors.clientId ? (
            <div className="text-red-500">{formik.errors.clientId}</div>
          ) : null}
        </div>

        {/* <div>
          <label htmlFor="subtotal" className="block font-medium mb-1">
            Subtotal
          </label>
          <Input
            type="number"
            name="subtotal"
            id="subtotal"
            value={formik.values.subTotal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.subTotal && formik.errors.subTotal ? (
            <div className="text-red-500">{formik.errors.subTotal}</div>
          ) : null}
        </div> */}

        {/* Tax */}
        {/* <div>
          <label htmlFor="tax" className="block font-medium mb-1">
            Tax
          </label>
          <Input
            type="number"
            name="tax"
            id="tax"
            value={formik.values.tax}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.tax && formik.errors.tax ? (
            <div className="text-red-500">{formik.errors.tax}</div>
          ) : null}
        </div> */}

        {/* Total Amount */}
        <div>
          <label htmlFor="totalAmount" className="block font-medium mb-1">
            Total Amount
          </label>
          <Input
            type="number"
            name="totalAmount"
            id="totalAmount"
            value={formik.values.totalAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.totalAmount && formik.errors.totalAmount ? (
            <div className="text-red-500">{formik.errors.totalAmount}</div>
          ) : null}
        </div>

        {/* Payment Status */}
        {/* <div>
          <label htmlFor="paymentStatus" className="block font-medium mb-1">
            Payment Status
          </label>
          <Input
            type="text"
            name="paymentStatus"
            id="paymentStatus"
            value={formik.values.paymentStatus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.paymentStatus && formik.errors.paymentStatus ? (
            <div className="text-red-500">{formik.errors.paymentStatus}</div>
          ) : null}
        </div> */}

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block font-medium mb-1">
            Due Date
          </label>
          <Input
            type="date"
            name="dueDate"
            id="dueDate"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
            <div className="text-red-500">{formik.errors.dueDate}</div>
          ) : null}
        </div>

        
        <div>
          <label htmlFor="status" className="block font-medium mb-1">
            Status
          </label>
          <Input
            type="text"
            name="status"
            id="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.status && formik.errors.status ? (
            <div className="text-red-500">{formik.errors.status}</div>
          ) : null}
        </div>

       

        {/* Submit Button */}
        <Button type="submit" className="mt-4">
          Update Invoice
        </Button>
      </form>
    </div>
  );
};

export default EditInvoicePage;
