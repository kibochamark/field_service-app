"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react"

type AttendanceRecord = {
  id: string
  employeeName: string
  date: string
  clockIn: string
  lunchStart: string
  lunchEnd: string
  clockOut: string
  status: "online" | "onbreak" | "offline"
}

export default function EmployeeAttendanceList() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // Simulated API call to fetch attendance records
    const fetchAttendanceRecords = async () => {
      // In a real application, this would be an API call
      const records: AttendanceRecord[] = [
        { id: "1", employeeName: "John Doe", date: "2023-05-15", clockIn: "09:00 AM", lunchStart: "12:00 PM", lunchEnd: "01:00 PM", clockOut: "05:00 PM", status: "offline" },
        { id: "2", employeeName: "Jane Smith", date: "2023-05-15", clockIn: "09:30 AM", lunchStart: "12:30 PM", lunchEnd: "01:30 PM", clockOut: "", status: "online" },
        { id: "3", employeeName: "Alice Johnson", date: "2023-05-15", clockIn: "08:45 AM", lunchStart: "12:15 PM", lunchEnd: "", clockOut: "", status: "onbreak" },
        { id: "4", employeeName: "Bob Brown", date: "2023-05-15", clockIn: "", lunchStart: "", lunchEnd: "", clockOut: "", status: "offline" },
        { id: "5", employeeName: "Charlie Davis", date: "2023-05-15", clockIn: "08:55 AM", lunchStart: "", lunchEnd: "", clockOut: "", status: "online" },
      ]
      setAttendanceRecords(records)
      setFilteredRecords(records)
    }

    fetchAttendanceRecords()
  }, [])

  useEffect(() => {
    const filtered = attendanceRecords.filter(record => 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || record.status === statusFilter)
    )
    setFilteredRecords(filtered)
  }, [searchTerm, statusFilter, attendanceRecords])

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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employee Attendance List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="onbreak">On Break</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Lunch Start</TableHead>
                <TableHead>Lunch End</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.clockIn || "-"}</TableCell>
                  <TableCell>{record.lunchStart || "-"}</TableCell>
                  <TableCell>{record.lunchEnd || "-"}</TableCell>
                  <TableCell>{record.clockOut || "-"}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}