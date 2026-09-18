import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { usePage, useForm } from "@inertiajs/react"
import { down } from "@/lib/functions"
import { useEffect } from "react"
import toast from "@/lib/toaster"

export default function ResetPassword ({ token, email }) {
  const { props } = usePage()
  const { data, setData, post, processing, errors, clearErrors } = useForm({ token, email, password: "", password_confirmation: "" })
  const change = (field, event) => {
    const value = event.target.value
    setData(field, value)
    clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    post("/reset-password")
  }
  useEffect(() => {
    const status = props.flash.status
    if (status) toast.info(status)
  }, [props.flash.status])
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Reset your password</CardTitle>
      <CardDescription>Enter a new password for {email}</CardDescription>
    </CardHeader>
    <CardContent>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" value={data.password} onChange={(event) => change("password", event)} aria-invalid={!!errors.password}/>
            <FieldError>{errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
            <Input id="password_confirmation" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={(event) => change("password_confirmation", event)} aria-invalid={!!errors.password_confirmation}/>
            <FieldError>{errors.password_confirmation}</FieldError>
          </Field>
          <Field>
            <Button processing={processing} type="submit">Reset password</Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
