"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { toast } from "react-toastify"; // For displaying success/error notifications

// Yup validation schema
const validationSchema = Yup.object().shape({
  clientId: Yup.string()
    .email("Invalid email format")
    .required("Client email is required"),
  subtotal: Yup.number().required("Subtotal is required"),
  tax: Yup.number().required("Tax is required"),
  totalAmount: Yup.number().required("Total amount is required"),
  paymentStatus: Yup.string().required("Payment status is required"),
  dueDate: Yup.date().required("Due date is required"),
  issueDate: Yup.date().required("Issue date is required"),
  status: Yup.string().required("Status is required"),
});

const EditInvoicePage = () => {
  const [loading, setLoading] = useState(true); // To manage the loading state
  const router = useRouter();
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState({
    clientId: "",
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    paymentStatus: "",
    dueDate: "",
    issueDate: "",
    status: "draft", // Default status value
  });

  // Fetch invoice details when page loads
  useEffect(() => {
    if (id) {
      axios
        .get(`https://field-service-management.vercel.app/api/v1/invoices/${id}`)
        .then((response) => {
          const data = response.data;

          // Ensure date fields are formatted properly
          setInitialValues({
            clientId: data.clientId || "",
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            totalAmount: data.totalAmount || 0,
            paymentStatus: data.paymentStatus || "",
            dueDate: data.dueDate
              ? new Date(data.dueDate).toISOString().split("T")[0]
              : "",
            issueDate: data.issueDate
              ? new Date(data.issueDate).toISOString().split("T")[0]
              : "",
            status: data.status || "draft",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching invoice data:", error);
          setLoading(false);
        });
    }
  }, [id]);

  // Formik form handling
  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Allows form to update when initialValues change
    validationSchema,
    onSubmit: (values) => {
      axios
        .put(
          `https://field-service-management.vercel.app/api/v1/invoice/${id}`,
          values
        )
        .then(() => {
          toast.success("Invoice updated successfully!");
          router.push("/invoices");
        })
        .catch((error) => {
          toast.error("Error updating invoice.");
          console.error("Error updating invoice:", error);
        });
    },
  });

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is fetched
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Client Email */}
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

        {/* Subtotal */}
        <div>
          <label htmlFor="subtotal" className="block font-medium mb-1">
            Subtotal
          </label>
          <Input
            type="number"
            name="subtotal"
            id="subtotal"
            value={formik.values.subtotal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.subtotal && formik.errors.subtotal ? (
            <div className="text-red-500">{formik.errors.subtotal}</div>
          ) : null}
        </div>

        {/* Tax */}
        <div>
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
        </div>

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
        <div>
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
        </div>

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

        {/* Issue Date */}
        <div>
          <label htmlFor="issueDate" className="block font-medium mb-1">
            Issue Date
          </label>
          <Input
            type="date"
            name="issueDate"
            id="issueDate"
            value={formik.values.issueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.issueDate && formik.errors.issueDate ? (
            <div className="text-red-500">{formik.errors.issueDate}</div>
          ) : null}
        </div>

        {/* Status */}
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
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoicePage;
