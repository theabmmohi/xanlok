import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { usePage, useForm, Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { down } from "@util/function"

import toast from "@util/toaster"

export default function ResetPassword ({ token, email }) {
  const { props } = usePage()
  const resetPasswordForm = useForm({ token, email, password: "", password_confirmation: "" })
  const change = (field, event) => {
    const value = event.target.value
    resetPasswordForm.setData(field, value)
    resetPasswordForm.clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    resetPasswordForm.post("/reset-password", {
      preserveScroll: true,
      onError: () => toast.error("This password reset link is either expired or used.")
    })
  }
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5"><Head title={`Reset Password - ${props.appname}`}/>
    <CardHeader>
      <CardTitle>Reset your password</CardTitle>
      <CardDescription>Enter a new password for {email}</CardDescription>
    </CardHeader>
    <CardContent>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" value={resetPasswordForm.data.password} onChange={(event) => change("password", event)} aria-invalid={!!resetPasswordForm.errors.password}/>
            <FieldError>{resetPasswordForm.errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
            <Input id="password_confirmation" type="password" placeholder="••••••••" value={resetPasswordForm.data.password_confirmation} onChange={(event) => change("password_confirmation", event)} aria-invalid={!!resetPasswordForm.errors.password_confirmation}/>
            <FieldError>{resetPasswordForm.errors.password_confirmation}</FieldError>
          </Field>
          <Field>
            <FieldError>{resetPasswordForm.errors.email}</FieldError>
            <Button processing={resetPasswordForm.processing} type="submit">Reset password</Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
