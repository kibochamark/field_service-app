'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronRight, Search, Trash2, Edit, Send, User } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Mock client data
const clients = [
  { id: '1', name: 'John Doe', email: 'john@example.com', company: 'ABC Corp' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'XYZ Inc' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', company: '123 LLC' },
]

// ClientSearch component
const ClientSearch = ({ onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
        <Button size="icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className="p-2 hover:bg-accent cursor-pointer"
              onClick={() => {
                onSelectClient(client)
                setIsDropdownOpen(false)
                setSearchTerm('')
              }}
            >
              <div className="font-medium">{client.name}</div>
              <div className="text-sm text-muted-foreground">{client.email}</div>
              <div className="text-sm text-muted-foreground">{client.company}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ClientInfo component
const ClientInfo = ({ client }) => {
  if (!client) return null

  return (
    <div className="p-2 bg-muted rounded-md">
      <div className="font-medium">{client.name}</div>
      <div className="text-sm text-muted-foreground">{client.email}</div>
      <div className="text-sm text-muted-foreground">{client.company}</div>
    </div>
  )
}

// Stepper component
const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            i < currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`h-1 w-full ${i < currentStep - 1 ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Step 1: Select or search client
const SelectClientStep = ({ onNext, selectedClient, onSelectClient }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select or Search Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientSearch onSelectClient={onSelectClient} />
        {selectedClient && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Client:</h3>
            <ClientInfo client={selectedClient} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} disabled={!selectedClient}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  )
}

// Step 2: Create invoice
const CreateInvoiceStep = ({ onNext, onPrev, selectedClient, invoice, setInvoice }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} />
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Invoice description"
              value={invoice.description}
              onChange={(e) => setInvoice({ ...invoice, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={invoice.amount}
              onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  )
}

// Step 3: View and edit invoice
const ViewEditInvoiceStep = ({ onNext, onPrev, selectedClient, invoice, setInvoice, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedInvoice, setEditedInvoice] = useState(invoice)

  const handleSave = () => {
    setInvoice(editedInvoice)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>View and Edit Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} />
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editedInvoice.description}
                  onChange={(e) => setEditedInvoice({ ...editedInvoice, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editedInvoice.amount}
                  onChange={(e) => setEditedInvoice({ ...editedInvoice, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editedInvoice.dueDate}
                  onChange={(e) => setEditedInvoice({ ...editedInvoice, dueDate: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">{invoice.description}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-sm text-muted-foreground">${invoice.amount}</p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="text-sm text-muted-foreground">{invoice.dueDate}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" className="mr-2" onClick={onPrev}>Previous</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this invoice?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the invoice.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div>
          {isEditing ? (
            <Button onClick={handleSave} className="mr-2">Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="mr-2"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
          )}
          <Button onClick={onNext}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Step 4: Send invoice
const SendInvoiceStep = ({ onPrev, selectedClient, invoice }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ClientInfo client={selectedClient} />
          <div>
            <Label htmlFor="email">Client Email</Label>
            <Input id="email" type="email" defaultValue={selectedClient?.email} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter a message for your client..." />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button><Send className="mr-2 h-4 w-4" /> Send Invoice</Button>
      </CardFooter>
    </Card>
  )
}

// Main component
export function InvoiceCreationPageComponent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const [invoice, setInvoice] = useState({
    description: '',
    amount: '',
    dueDate: '',
  })
  const totalSteps = 4

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleDelete = () => {
    // In a real application, you would delete the invoice from your backend here
    setInvoice({ description: '', amount: '', dueDate: '' })
    setCurrentStep(2) // Go back to create invoice step
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      {currentStep === 1 && (
        <SelectClientStep
          onNext={nextStep}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
        />
      )}
      {currentStep === 2 && (
        <CreateInvoiceStep
          onNext={nextStep}
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
          setInvoice={setInvoice}
        />
      )}
      {currentStep === 3 && (
        <ViewEditInvoiceStep
          onNext={nextStep}
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
          setInvoice={setInvoice}
          onDelete={handleDelete}
        />
      )}
      {currentStep === 4 && (
        <SendInvoiceStep
          onPrev={prevStep}
          selectedClient={selectedClient}
          invoice={invoice}
        />
      )}
    </div>
  )
}