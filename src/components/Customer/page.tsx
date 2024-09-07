"use client"
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Customer, columns } from "./columns";
import { DataTable } from "./data-table";
import { PlusCircle } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { getCustomers } from "./CustomerActions";
import CustomerForm from "./AddCustomer";
import { RootState } from '../../../store/Store';
import { openForm } from '../../../store/CustomerSlice';
import Topcard from './Topcard';
import EditCustomer from './EditCustomer';

interface DemoPageProps {
  customersinfo: {
    number_of_active_customers: number;
    number_of_customers: number;
    number_of_inactive_customers: number;
  };
}

// Function to fetch data asynchronously
async function getData(): Promise<Customer[]> {
  try {
    const data = await getCustomers();
    return data ?? []; // Return an empty array if data is undefined
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    return []; // Ensure an empty array is returned in case of an error
  }
}

export default function DemoPage({ customersinfo }: DemoPageProps) { // Accept customersinfo as prop
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.customerForm.isOpen); // Accessing the form state
  const [data, setData] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const customers = await getData();
      setData(customers);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full bg-white p-4">
      <div className="w-full flex justify-end">
        <Button className="mt-2 bg-primary700 flex justify-items-center gap-2" onClick={() => dispatch(openForm())}>
          <PlusCircle className="h-5.5 w-5.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add New Customer
          </span>
        </Button>
      </div>

      {/* Pass customersinfo to Topcard */}
      <div className=''>
        <Topcard customersinfo={customersinfo} />
      </div>

      <div className="bg-slate-100">
        <DataTable columns={columns} data={data} />
      </div>

      {isOpen && <CustomerForm />} {/* Render the form only if isOpen is true */}
    </div>
  );
}
