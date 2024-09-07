"use client"

import { Card, CardContent } from "@/shadcn/ui/card"

interface TopcardProps {
  customersinfo: {
    number_of_active_customers: number
    number_of_customers: number
    number_of_inactive_customers: number
  }
}

const Topcard: React.FC<TopcardProps> = ({ customersinfo }) => {
  return (
    <Card className="max-w-xs">
      <CardContent className="flex gap-4 p-4">
        <div className="grid items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Active Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_active_customers}
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_customers}
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-muted-foreground">Inactive Customers</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {customersinfo.number_of_inactive_customers}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Topcard
