import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import toast from "@/lib/toaster"

export default function ConfirmPassword () {
  const passwordForm = useForm({ password: "" })
  const submit = (event) => {
    event.preventDefault()
    passwordForm.post("/user/confirm-password")
  }
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Confirm your password</CardTitle>
      <CardDescription>This is a security-sensitive action. Please re-enter your password to continue.</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" value={passwordForm.data.password} onChange={(event) => { passwordForm.setData("password", event.target.value); passwordForm.clearErrors("password") }} aria-invalid={!!passwordForm.errors.password} autoFocus/>
            <FieldError>{passwordForm.errors.password}</FieldError>
          </Field>
          <Field>
            <Button type="submit" processing={passwordForm.processing}>Confirm</Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
