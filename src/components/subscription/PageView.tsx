"use client"

import { useEffect, useState } from "react"
import { CreditCard, Check, Loader } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { useFormik } from "formik"
import { addMonths } from "date-fns"
import { useSession } from "next-auth/react"
import * as Yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { CreateSubscribe, Sub } from "./SubscriptionRequests"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

// const plans = [
//   { 
//     name: "Basic", 
//     price: "$9.99/month",
//     features: ["10 users included", "2GB of storage", "Email support"],
//     color: "border-blue-500"
//   },
//   { 
//     name: "Standard", 
//     price: "$19.99/month",
//     features: ["20 users included", "10GB of storage", "Priority email support"],
//     color: "border-green-500"
//   },
//   { 
//     name: "Premium", 
//     price: "$29.99/month",
//     features: ["Unlimited users", "Unlimited storage", "24/7 phone & email support"],
//     color: "border-purple-500"
//   },
// ]

export default function Subscribe({ plans }: { plans: any }) {
  const [selectedPlan, setSelectedPlan] = useState("Basic")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const { data: session, update } = useSession()

  const router = useRouter()


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Subscription submitted:", { selectedPlan, paymentMethod })
  }


  const formik = useFormik({
    initialValues: {
      planId: "",
      companyId: "",
      startDate: new Date(),
      endDate: addMonths(new Date(), 1)
    },
    validationSchema: Yup.object().shape({
      planId: Yup.string().required()
    }),
    onSubmit: (values) => {
      console.log(values)
      subscribemutation.mutate({ values: values })

    }
  })

  useEffect(() => {
    if (session) {
      formik.setFieldValue("companyId", session?.user?.companyId)
    }
  }, [session])

  const subscribemutation = useMutation({
    mutationFn: async (values: any) => {
      const res = await CreateSubscribe(values)

      return res
    },
    onSuccess(data, variables, context) {

      if (Object.values(data).length > 0) {
        update({ isSubscribed: true })

        
        setTimeout(() => {

          toast.success("Subscribed Successfully")
        }, 1000)
        setTimeout(() => {

          toast.success("You will be directly shortly")
        }, 1000)
       
        setTimeout(() => {

          router.push("/callpro/dashboard")
        }, 4000)

      } else {
        toast.error("Failed to create subscription, please try again")
      }

 


    },
    onError(error, variables, context) {
      console.log(error, "error")
      toast.error("Error in creating subscription")
    },
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choose Your Subscription Plan
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select a plan and complete your subscription
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Timeline Plans */}
          <div className="w-full lg:w-1/2 space-y-8">
            {plans.length > 0 && plans?.map((plan: any, index: number) => (
              <div key={plan.name} className={`relative pl-8 pb-8 border-l-2 border-blue-500`}>
                <div className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-1/2 bg-blue-500`} />
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>{plan?.name}</CardTitle>
                    <CardDescription>${plan?.price}/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.values(plan?.description)?.map((feature: any, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={selectedPlan === plan?.name ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedPlan(plan?.name)}
                    >
                      {selectedPlan === plan?.name ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Payment Form */}

          <Card className="w-full lg:w-1/2">
            <form onSubmit={formik.handleSubmit}>
              <CardHeader>
                <CardTitle>Complete Your Subscription</CardTitle>
                <CardDescription>Enter your payment details</CardDescription>
              </CardHeader>
              <CardContent>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Selected Plan</Label>
                    <Select value={formik.values.planId} onValueChange={(value) => {
                      formik.setFieldValue("planId", value)
                    }}>
                      <SelectTrigger id="plan">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      {formik.touched.planId && formik.errors.planId && (
                        <p className="text-red-400 text-sm">{formik.errors.planId}</p>
                      )}
                      <SelectContent>
                        {plans.map((plan: any) => (
                          <SelectItem key={plan?.name} value={plan?.id}>
                            {plan?.name} - ${plan?.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="mr-2 h-6 w-6 text-blue-500" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center">
                          <svg className="mr-2 h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.5 4.534-6.104 4.534H12.78a1.28 1.28 0 0 0-1.266 1.08l-.917 5.81-.233 1.474a.639.639 0 0 0 .632.74h3.39c.524 0 .968-.382 1.05-.9l.041-.254.794-5.02.052-.294a1.28 1.28 0 0 1 1.266-1.08h.804c3.604 0 6.424-1.46 7.252-5.683.35-1.803.175-3.307-.788-4.362-.097-.107-.2-.21-.309-.308z" />
                          </svg>
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Expiry Date</Label>
                          <Input id="expiry-date" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="text-sm text-muted-foreground">
                      You will be redirected to PayPal to complete your payment.
                    </div>
                  )}
                </div>

              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full disabled:bg-gray-100" disabled={subscribemutation.isPending}>
                  {subscribemutation.isPending ? <Loader className="animate animate-spin text-primary500 flex items-center justify-center" /> : "Subscribe Now"}
                </Button>
              </CardFooter>
            </form>
          </Card>

        </div>
      </div>
    </div>
  )
}