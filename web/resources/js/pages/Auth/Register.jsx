import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LoaderCircle, CircleCheck, Ban } from "lucide-react"
import { useForm, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Google } from "@thesvg/react"
import { down } from "@util/function"

import toast from "@util/toaster"

export default function Register () {
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState("idle") // "idle" | "loading" | "valid" | "invalid"
  const [errorMessage, setErrorMessage] = useState("")
  useEffect(() => {
    setStatus("loading")
    const timer = setTimeout(async () => {
      if (!username) {
        setStatus("idle")
        setErrorMessage("")
        return
      }
      const ragex = /^[a-z]{5,25}$/
      if (!ragex.test(username)) {
        setStatus("invalid")
        if (username !== username.toLowerCase()) setErrorMessage("Username must contain lowercase letters only.")
        else if (username.length < 5) setErrorMessage("Username must be at least 5 characters long.")
        else if (username.length > 25) setErrorMessage("Username cannot exceed 25 characters.")
        else setErrorMessage("Invalid username format.")
        return
      }
      try {
        const resp = await fetch("/check/username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "")
          },
          body: JSON.stringify({ username })
        })
        const data = await resp.json()
        if (data?.available) {
          setStatus("valid")
          setErrorMessage("")
        } else {
          setStatus("invalid")
          setErrorMessage("Username is already taken.")
        }
      } catch (_) {
          setStatus("invalid")
          setErrorMessage("Could not check availability. Try again.")
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [username])
  const registerForm = useForm({ name: "", username: "", email: "", password: "", password_confirmation: "" })
  const change = (field, event) => {
    const value = event.target.value
    if (field === "username") {
      const sanitized = value.toLowerCase().replace(/[^a-z]/g, "")
      setUsername(sanitized)
      registerForm.setData(field, sanitized)
    } else {
      registerForm.setData(field, value)
    }
    registerForm.clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    registerForm.post("/register")
  }
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>Enter your information below to create your account</CardDescription>
    </CardHeader>
    <CardContent>
      <form noValidate onSubmit={submit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" value={registerForm.data.name} onChange={(event) => change("name", event)} aria-invalid={!!registerForm.errors.name}/>
            <FieldError>{registerForm.errors.name}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <div className="relative">
              <Input id="username" type="text" autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="johndoe" value={registerForm.data.username} onChange={(event) => change("username", event)} aria-invalid={!!registerForm.errors.username || status === "invalid"} className="pr-8"/>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {status === "loading" && <LoaderCircle className="size-4 animate-spin text-muted-foreground" />}
                {status === "valid" && <CircleCheck className="size-4 text-green-600" />}
                {status === "invalid" && <Ban className="size-4 text-destructive" />}
              </span>
            </div>
            <FieldError>{registerForm.errors.username || errorMessage}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="name@example.com" value={registerForm.data.email} onChange={(event) => change("email", event)} aria-invalid={!!registerForm.errors.email}/>
            <FieldError>{registerForm.errors.email}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" value={registerForm.data.password} onChange={(event) => change("password", event)} aria-invalid={!!registerForm.errors.password}/>
            <FieldError>{registerForm.errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
            <Input id="password_confirmation" type="password" placeholder="••••••••" value={registerForm.data.password_confirmation} onChange={(event) => change("password_confirmation", event)} aria-invalid={!!registerForm.errors.password_confirmation}/>
            <FieldError>{registerForm.errors.password_confirmation}</FieldError>
          </Field>
          <FieldGroup>
            <Field>
              <Button processing={registerForm.processing} type="submit">Create Account</Button>
              <Button variant="outline" type="button" onClick={() => toast.error("Not available.")}>
                <Google/>Continue with Google
              </Button>
              <FieldDescription className="px-6 text-center">Already have an account? <Link href="/login">Login</Link></FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
}
