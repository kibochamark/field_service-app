"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { Search } from "lucide-react"

type AttendanceRecord = {
  id: string
  date: string
  clockIn: string
  lunchStart: string
  lunchEnd: string
  clockOut: string
}

export default function EmployeeAttendance({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<{ name: string, position: string } | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulated API call to fetch employee details and attendance records
    const fetchEmployeeData = async () => {
      // In a real application, this would be an API call using the employeeId
      const employeeData = { name: "John Doe", position: "Software Developer" }
      setEmployee(employeeData)

      const records: AttendanceRecord[] = [
        { id: "1", date: "2023-05-15", clockIn: "09:00 AM", lunchStart: "12:00 PM", lunchEnd: "01:00 PM", clockOut: "05:00 PM" },
        { id: "2", date: "2023-05-16", clockIn: "09:30 AM", lunchStart: "12:30 PM", lunchEnd: "01:30 PM", clockOut: "05:30 PM" },
        { id: "3", date: "2023-05-17", clockIn: "08:45 AM", lunchStart: "12:15 PM", lunchEnd: "01:15 PM", clockOut: "04:45 PM" },
        { id: "4", date: "2023-05-18", clockIn: "09:15 AM", lunchStart: "12:45 PM", lunchEnd: "01:45 PM", clockOut: "05:15 PM" },
        { id: "5", date: "2023-05-19", clockIn: "08:55 AM", lunchStart: "12:25 PM", lunchEnd: "01:25 PM", clockOut: "04:55 PM" },
      ]
      setAttendanceRecords(records)
      setFilteredRecords(records)
    }

    fetchEmployeeData()
  }, [employeeId])

  useEffect(() => {
    const filtered = attendanceRecords.filter(record => 
      record.date.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRecords(filtered)
  }, [searchTerm, attendanceRecords])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Lunch Start</TableHead>
                <TableHead>Lunch End</TableHead>
                <TableHead>Clock Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.clockIn || "-"}</TableCell>
                  <TableCell>{record.lunchStart || "-"}</TableCell>
                  <TableCell>{record.lunchEnd || "-"}</TableCell>
                  <TableCell>{record.clockOut || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredRecords.length === 0 && (
          <p className="text-center mt-4 text-muted-foreground">No attendance records found.</p>
        )}
      </CardContent>
    </Card>
  )
}