import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { usePasskeyVerify } from "@laravel/passkeys/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForm, Link } from "@inertiajs/react"
import { Fingerprint } from "lucide-react"
import { Google } from "@thesvg/react"
import { down } from "@/lib/functions"
import toast from "@/lib/toaster"


export default function Login () {
  const loginForm = useForm({ identifier: "", password: "", remember: false })
  const { verify, isLoading: passkeyLoading } = usePasskeyVerify({
    onSuccess: (response) => router.visit(response.redirect ?? "/"),
    onError: (error) => toast.error(error?.message ?? "Passkey login failed.")
  })
  const change = (field, event) => {
    const value = event.target.value
    loginForm.setData(field, value)
    loginForm.clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    loginForm.post("/login")
  }
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
            <Input id="identifier" type="text" autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="name@example.com" value={loginForm.data.identifier} onChange={(event) => change("identifier", event)} aria-invalid={!!loginForm.errors.identifier}/>
            <FieldError>{loginForm.errors.identifier}</FieldError>
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link href="/forgot-password" className="ml-auto inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary">Forgot password?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={loginForm.data.password} onChange={(event) => change("password", event)} aria-invalid={!!loginForm.errors.password}/>
            <FieldError>{loginForm.errors.password}</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="remember" checked={loginForm.data.remember} onCheckedChange={(checked) => loginForm.setData("remember", checked)}/>
            <FieldLabel htmlFor="remember">Remember me</FieldLabel>
          </Field>
          <Field>
            <Button processing={loginForm.processing} type="submit">Login</Button>
            <Button variant="outline" type="button" onClick={() => toast.error("Not available.")}>
              <Google/>
              Continue with Google
            </Button>
            <Button variant="outline" type="button" processing={passkeyLoading} onClick={verify}>
              { passkeyLoading ? null : <Fingerprint/> }
              Continue with passkey
            </Button>
            <FieldDescription className="text-center">Don&apos;t have an account? <Link href="/register">Register</Link></FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
