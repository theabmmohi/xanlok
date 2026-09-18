import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { usePage, useForm, Link } from "@inertiajs/react"
import { Google } from "@thesvg/react"
import { down } from "@/lib/functions"
import { useEffect } from "react"
import toast from "@/lib/toaster"

export default function Login () {
  const { props } = usePage()
  const { data, setData, post, processing, errors, clearErrors } = useForm({ identifier: "", password: "", remember: false })
  const change = (field, event) => {
    const value = event.target.value
    setData(field, value)
    clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    post("/login")
  }
  useEffect(() => {
    const status = props.flash.status
    if (status) toast.info(status)
  }, [props.flash.status])
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email or username below to login to your account</CardDescription>
    </CardHeader>
    <CardContent>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="identifier">Email or username</FieldLabel>
            <Input id="identifier" type="text" autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="name@example.com" value={data.identifier} onChange={(event) => change("identifier", event)} aria-invalid={!!errors.identifier}/>
            <FieldError>{errors.identifier}</FieldError>
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link href="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={data.password} onChange={(event) => change("password", event)} aria-invalid={!!errors.password}/>
            <FieldError>{errors.password}</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData("remember", checked)}/>
            <FieldLabel htmlFor="remember">Remember me</FieldLabel>
          </Field>
          <Field>
            <Button processing={processing} type="submit">Login</Button>
            <Button variant="outline" type="button" onClick={() => toast.error("Not available.")}>
              <Google/>Continue with Google
            </Button>
            <FieldDescription className="text-center">Don&apos;t have an account? <Link href="/register">Register</Link></FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
