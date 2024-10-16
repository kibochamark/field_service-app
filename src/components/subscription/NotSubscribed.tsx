import { AlertTriangle, LogOut } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { signOut } from "next-auth/react"

export default function NotSubscribed() {
  const handleLogout = () => {
    signOut()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Subscription Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Your company's subscription has expired. Please contact your company administrator to renew the subscription and continue using our services.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}