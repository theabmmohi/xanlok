import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useForm, Link } from "@inertiajs/react"
import { down } from "@/lib/functions"
import toast from "@/lib/toaster"

export function RegisterForm({ className, ...props }) {
  const { data, setData, post, processing, errors, clearErrors } = useForm({ name: "", email: "", password: "", password_confirmation: "" })
  const change = (field, event) => {
    const value = event.target.value
    setData(field, value)
    clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    post("/register")
  }
  return <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)} {...props}>
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" value={data.name} onChange={(event) => change("name", event)} aria-invalid={!!errors.name}/>
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="name@example.com" value={data.email} onChange={(event) => change("email", event)} aria-invalid={!!errors.email}/>
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" value={data.password} onChange={(event) => change("password", event)} aria-invalid={!!errors.password}/>
              <FieldError>{errors.password}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
              <Input id="password_confirmation" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={(event) => change("password_confirmation", event)} aria-invalid={!!errors.password_confirmation}/>
              <FieldError>{errors.password_confirmation}</FieldError>
            </Field>
            <FieldGroup>
              <Field>
                <Button processing={processing} type="submit">Create Account</Button>
                <Button variant="outline" type="button" onClick={() => toast.error("Not available.")}>Continue with Google</Button>
                <FieldDescription className="px-6 text-center">Already have an account? <Link href="/login">Login</Link></FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
}
