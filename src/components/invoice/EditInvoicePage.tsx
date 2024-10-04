"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { toast } from "react-toastify"; // For displaying success/error notifications
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const EditInvoicePage = () => {
  const [invoice, setInvoice] = useState({
    clientId: "",
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    paymentStatus: "",
    dueDate: "",
    issueDate: "",
    status: "draft", // default status value
  });

  const router = useRouter();
  const edit = useSelector((state: RootState) => state.customerForm.isedit);
  console.log(edit, "data to edit")

  // const { id } = router.query; // Get invoice ID from URL

  // Fetch invoice details when page loads
  useEffect(() => {
      axios
        .get(
          `https://field-service-management.vercel.app/api/v1/invoice/${id}`
        )
        .then((response) => {
          setInvoice(response.data); // Populate form with existing data
        })
        .catch((error) => {
          console.error("Error fetching invoice data:", error);
        });
    },[]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .put(
        `https://field-service-management.vercel.app/api/v1/invoice/`,
        invoice
      )
      .then(() => {
        toast.success("Invoice updated successfully!");
        router.push("/invoices"); // Redirect to invoices page after update
      })
      .catch((error) => {
        toast.error("Error updating invoice.");
        console.error("Error updating invoice:", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Email */}
        <div>
          <label htmlFor="clientId" className="block font-medium mb-1">
            Client Email
          </label>
          <Input
            type="email"
            name="clientId"
            id="clientId"
            value={invoice.clientId}
            onChange={handleInputChange}
            required
          />
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
            value={invoice.subtotal}
            onChange={handleInputChange}
            required
          />
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
            value={invoice.tax}
            onChange={handleInputChange}
            required
          />
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
            value={invoice.totalAmount}
            onChange={handleInputChange}
            required
          />
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
            value={invoice.paymentStatus}
            onChange={handleInputChange}
            required
          />
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
            value={new Date(invoice.dueDate).toISOString().split("T")[0]} // Format date for input field
            onChange={handleInputChange}
            required
          />
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
            value={new Date(invoice.issueDate).toISOString().split("T")[0]} // Format date for input field
            onChange={handleInputChange}
            required
          />
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
            value={invoice.status}
            onChange={handleInputChange}
            required
          />
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
