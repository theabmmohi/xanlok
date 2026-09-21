import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useForm, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { down } from "@util/function"

import toast from "@util/toaster"

export default function ForgotPassword () {
  const forgotPasswordForm = useForm({ email: "" })
  const change = (field, event) => {
    const value = event.target.value
    forgotPasswordForm.setData(field, value)
    forgotPasswordForm.clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    forgotPasswordForm.post("/forgot-password")
  }
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Forgot your password?</CardTitle>
      <CardDescription>Enter your email and we&apos;ll send you a link to reset it</CardDescription>
    </CardHeader>
    <CardContent>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="name@example.com" value={forgotPasswordForm.data.email} onChange={(event) => change("email", event)} aria-invalid={!!forgotPasswordForm.errors.email}/>
            <FieldError>{forgotPasswordForm.errors.email}</FieldError>
          </Field>
          <Field>
            <Button processing={forgotPasswordForm.processing} type="submit">Send reset link</Button>
            <FieldDescription className="text-center">Remembered it? <Link href="/login">Back to login</Link></FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
