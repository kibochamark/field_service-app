import { User, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise< User[]> {
  // Fetch data from your API here.
  return [
    
        {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: "Admin",
            createdAt: "2023-08-01T12:34:56Z", 
            updatedAt: "2023-08-15T08:22:11Z",
            permissions: ["read", "write", "delete"],
          
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
