"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent } from "@/shadcn/ui/card"
import { Clock, X, ChevronUp, Coffee, LogOut, User, Calendar, Loader } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { useMutation } from "@tanstack/react-query"
import { clockin, clockout, lunchend, lunchstart } from "./ClockinActions"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../store/Store"
import { handledata } from "../../../store/ClockSlice"

type Status = "Not Clocked In" | "Clocked In" | "Lunch Break" | "Clocked Out"

type TimeLog = {
  action: string
  time: Date
}

type DailyAttendance = {
  date: string
  clockIn: string
  lunchStart: string
  lunchEnd: string
  clockOut: string
}

export default function ClockIn() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [status, setStatus] = useState<Status>("Not Clocked In")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([])



  const clockindata = useSelector((state:RootState) => state.clock.data)
  const dispatch = useDispatch()


  const [attendanceHistory, setAttendanceHistory] = useState<DailyAttendance[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (status === "Clocked In" || status === "Lunch Break") {
      interval = setInterval(() => {
        if (startTime) {
          const now = new Date()
          setElapsedTime(Math.floor((now.getTime() - startTime.getTime()) / 1000))
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [status, startTime])

  useEffect(() => {
    // Simulated attendance history data
    const simulatedHistory: DailyAttendance[] = [
      {
        date: "2023-05-15",
        clockIn: "09:00 AM",
        lunchStart: "12:30 PM",
        lunchEnd: "01:30 PM",
        clockOut: "05:30 PM",
      },
      {
        date: "2023-05-16",
        clockIn: "08:45 AM",
        lunchStart: "12:15 PM",
        lunchEnd: "01:15 PM",
        clockOut: "05:15 PM",
      },
      {
        date: "2023-05-17",
        clockIn: "09:15 AM",
        lunchStart: "01:00 PM",
        lunchEnd: "02:00 PM",
        clockOut: "06:00 PM",
      },
    ]
    setAttendanceHistory(simulatedHistory)
  }, [])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  const logAction = (action: string) => {
    const newLog: TimeLog = { action, time: new Date() }
    setTimeLogs([...timeLogs, newLog])
  }

  const handleClockIn = () => {

    clockinmutation.mutate()


  }

  const handleLunchBreak = () => {
    lunchstartmutation.mutate()
    setStatus("Lunch Break")
    logAction("Started Lunch Break")
  }

  const handleReturnFromLunch = () => {
    lunchendmutation.mutate()
    setStatus("Clocked In")
    logAction("Ended Lunch Break")
  }

  const handleClockOut = () => {
    clockoutmutation.mutate()
    setStatus("Clocked Out")
    setStartTime(null)
    logAction("Clocked Out")

    // Add today's attendance to history
    const today = new Date().toISOString().split('T')[0]
    const todayLogs = timeLogs.reduce((acc, log) => {
      if (log.action === "Clocked In") acc.clockIn = log.time.toLocaleTimeString()
      if (log.action === "Started Lunch Break") acc.lunchStart = log.time.toLocaleTimeString()
      if (log.action === "Ended Lunch Break") acc.lunchEnd = log.time.toLocaleTimeString()
      if (log.action === "Clocked Out") acc.clockOut = log.time.toLocaleTimeString()
      return acc
    }, { date: today, clockIn: "", lunchStart: "", lunchEnd: "", clockOut: "" } as DailyAttendance)

    setAttendanceHistory([todayLogs, ...attendanceHistory])
    setTimeLogs([])
  }


  // mutations

  const clockinmutation = useMutation({
    mutationFn: async () => {
      const data = await clockin()
      return data
    },
    onSuccess(data, variables, context) {
      if (data[1] == 201) {
        toast.success("clocked in successfully")
        setStatus("Clocked In")
        setStartTime(new Date())
        dispatch(handledata({data:data[0]?.data?.id}))
        setElapsedTime(0)
        logAction("Clocked In")
      } else {
        toast.error("Failed to clock in")
      }
    },
    onError(error, variables, context) {
      toast.error("Something went wrong")
    },
  })


  const clockoutmutation = useMutation({
    mutationFn: async () => {
      const data = await clockout(clockindata as string)
      return data
    },
    onSuccess(data, variables, context) {
      if (data[1] == 201) {
        toast.success("clocked out successfully")
        setStatus("Clocked Out")
        setStartTime(null)
        logAction("Clocked Out")
      } else {
        toast.error("Failed to clock out")
      }
    },
    onError(error, variables, context) {
      toast.error("Something went wrong")
    },
  })
  const lunchstartmutation = useMutation({
    mutationFn: async () => {
      const data = await lunchstart(clockindata as string)
      return data
    },
    onSuccess(data, variables, context) {
      if (data[1] == 200) {
        toast.success("lunch start successfully")
        setStatus("Lunch Break")
        logAction("Started Lunch Break")
      } else {
        toast.error("Failed to start lunch")
      }
    },
    onError(error, variables, context) {
      toast.error("Something went wrong")
    },
  })
  const lunchendmutation = useMutation({
    mutationFn: async () => {
      const data = await lunchend(clockindata as string)
      return data
    },
    onSuccess(data, variables, context) {
      if (data[1] == 200) {
        toast.success("lunch end successful")
        setStatus("Clocked In")
        logAction("Ended Lunch Break")
      } else {
        toast.error("Failed to end lunch")
      }
    },
    onError(error, variables, context) {
      toast.error("Something went wrong")
    },
  })

  return (
    <>
      <StatusBar status={status} />
      <div className="fixed bottom-4 right-4 z-50">
        {isExpanded ? (
          <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Clock-In System</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="text-lg font-bold text-primary">{status}</p>
                </div>
                {(status === "Clocked In" || status === "Lunch Break") && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Time Elapsed</p>
                    <p className="text-lg font-mono">{formatTime(elapsedTime)}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleClockIn} disabled={(status !== "Not Clocked In" && status !== "Clocked Out") || clockinmutation.isPending}>
                    {clockinmutation.isPending ? <Loader className="animate animate-spin text-white" /> : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Clock In
                      </>
                    )}

                  </Button>
                  <Button onClick={handleLunchBreak} disabled={status !== "Clocked In" || lunchstartmutation.isPending}>


                    {lunchstartmutation.isPending ? <Loader className="animate animate-spin text-white" /> : (
                      <>
                        <Coffee className="mr-2 h-4 w-4" />
                        Start Lunch
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReturnFromLunch} disabled={status !== "Lunch Break" || lunchendmutation.isPending}>


                    {lunchendmutation.isPending ? <Loader className="animate animate-spin text-white" /> : (
                      <>
                        <Coffee className="mr-2 h-4 w-4" />
                        End Lunch
                      </>
                    )}
                  </Button>
                  <Button onClick={handleClockOut} disabled={status === "Not Clocked In" || status === "Clocked Out" || clockoutmutation.isPending}>
                    {clockoutmutation.isPending ? <Loader className="animate animate-spin text-white" /> : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Clock Out
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Today's Time Log</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {timeLogs.map((log, index) => (
                      <div key={index} className="text-sm mb-1">
                        <span className="font-semibold">{log.action}:</span>{" "}
                        {log.time.toLocaleTimeString()}
                      </div>
                    ))}
                  </div>
                </div>
                <AttendanceHistoryDialog attendanceHistory={attendanceHistory} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 animate animate-pulse shadow-lg"
                  onClick={() => setIsExpanded(true)}
                  variant="default"
                >
                  <Clock className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Clock-In Widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  )
}



function StatusBar({ status }: { status: Status }) {
  return (
    <div className="flex justify-end items-center  p-2 z-50 mb-4">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full space-x-2 border ${status === "Clocked In"
          ? "bg-green-100 border-green-500 text-green-800"
          : status === "Lunch Break"
            ? "bg-yellow-100 border-yellow-500 text-yellow-800"
            : status === "Clocked Out"
              ? "bg-red-100 border-red-500 text-red-800"
              : "bg-gray-100 border-gray-500 text-gray-800"
          }`}
      >
        <User className="h-5 w-5" />
        <span className="font-semibold text-gray-700">Status:</span>
        <span
          className={`px-2 py-1 rounded-full text-sm font-bold ${status === "Clocked In"
            ? "bg-green-500 text-white"
            : status === "Lunch Break"
              ? "bg-yellow-500 text-black"
              : status === "Clocked Out"
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
            }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}


function AttendanceHistoryDialog({ attendanceHistory }: { attendanceHistory: DailyAttendance[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          View Attendance History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Attendance History</DialogTitle>
        </DialogHeader>
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
            {attendanceHistory.map((day, index) => (
              <TableRow key={index}>
                <TableCell>{day.date}</TableCell>
                <TableCell>{day.clockIn}</TableCell>
                <TableCell>{day.lunchStart}</TableCell>
                <TableCell>{day.lunchEnd}</TableCell>
                <TableCell>{day.clockOut}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}