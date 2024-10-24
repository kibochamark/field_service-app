"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

type AttendanceRecord = {
  id: string
  date: string
  clockIn: string
  lunchStart: string
  lunchEnd: string
  clockOut: string
  status: "online" | "onbreak" | "offline"
}

export default function EmployeeAttendance({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<{ name: string, position: string } | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // Simulated API call to fetch employee details and attendance records
    const fetchEmployeeData = async () => {
      // In a real application, this would be an API call using the employeeId
      const employeeData = { name: "John Doe", position: "Software Developer" }
      setEmployee(employeeData)

      const records: AttendanceRecord[] = [
        { id: "1", date: "2023-05-15", clockIn: "09:00 AM", lunchStart: "12:00 PM", lunchEnd: "01:00 PM", clockOut: "05:00 PM", status: "offline" },
        { id: "2", date: "2023-05-16", clockIn: "09:30 AM", lunchStart: "12:30 PM", lunchEnd: "01:30 PM", clockOut: "", status: "online" },
        { id: "3", date: "2023-05-17", clockIn: "08:45 AM", lunchStart: "12:15 PM", lunchEnd: "", clockOut: "", status: "onbreak" },
        { id: "4", date: "2023-05-18", clockIn: "", lunchStart: "", lunchEnd: "", clockOut: "", status: "offline" },
        { id: "5", date: "2023-05-19", clockIn: "08:55 AM", lunchStart: "", lunchEnd: "", clockOut: "", status: "online" },
      ]
      setAttendanceRecords(records)
    }

    fetchEmployeeData()
  }, [employeeId])

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const statusStyles = {
      online: "bg-green-100 text-green-800",
      onbreak: "bg-yellow-100 text-yellow-800",
      offline: "bg-gray-100 text-gray-800"
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
        {status}
      </span>
    )
  }

  const currentRecord = attendanceRecords.find(record => record.date === currentDate.toISOString().split('T')[0])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employee Attendance Details</CardTitle>
      </CardHeader>
      <CardContent>
        {employee && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.position}</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center bg-muted px-3 py-1 rounded-md">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{currentDate.toLocaleDateString()}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clock In</TableHead>
                <TableHead>Lunch Start</TableHead>
                <TableHead>Lunch End</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecord ? (
                <TableRow>
                  <TableCell>{currentRecord.clockIn || "-"}</TableCell>
                  <TableCell>{currentRecord.lunchStart || "-"}</TableCell>
                  <TableCell>{currentRecord.lunchEnd || "-"}</TableCell>
                  <TableCell>{currentRecord.clockOut || "-"}</TableCell>
                  <TableCell>{getStatusBadge(currentRecord.status)}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No attendance record for this date</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}