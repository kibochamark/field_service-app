import HandleAddEdit from "./HandleAddEdit"
import { auth } from "@/auth"
import { getRoles } from "@/app/callpro/employee/page"


export async function EmployeeManagement() {
  const session = await auth()
  if (!session) return null
  const roles = await getRoles(session?.user?.access_token as string ?? "") ?? []

  console.log(roles)
  return (

    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <HandleAddEdit roles={roles} />
    </main>

  )
}