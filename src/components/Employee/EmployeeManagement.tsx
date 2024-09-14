import HandleAddEdit from "./HandleAddEdit"
import { auth } from "@/auth"
import { Suspense } from "react"
import { Loader } from "lucide-react"
import { getEmployees, getRoles } from "./EmployeeActions"


export async function EmployeeManagement() {
  const session = await auth()
  if (!session) return null
  const roles = await getRoles(session?.user?.access_token as string ?? "") ?? []
  const employees = await getEmployees() ?? []



  return (

    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Suspense fallback={<Loader className="animate animate-spin text-primary600"/>}>
        <HandleAddEdit roles={roles} employees={employees} />
      </Suspense>
    </main>

  )
}