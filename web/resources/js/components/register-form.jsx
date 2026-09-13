import { cn } from "cn"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { LoaderCircle, CircleCheck, Ban } from "lucide-react"
import { useForm, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { down } from "@/lib/functions"
import toast from "@/lib/toaster"

export function RegisterForm({ className, ...props }) {
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
  const { data, setData, post, processing, errors, clearErrors } = useForm({ name: "", username: "", email: "", password: "", password_confirmation: "" })
  const change = (field, event) => {
    const value = event.target.value
    if (field === "username") {
      const sanitized = value.toLowerCase().replace(/[^a-z]/g, "")
      setUsername(sanitized)
      setData(field, sanitized)
    } else {
      setData(field, value)
    }
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
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative">
                <Input id="username" type="text" autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="johndoe" value={data.username} onChange={(event) => change("username", event)} aria-invalid={!!errors.username || status === "invalid"} className="pr-8"/>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  {status === "loading" && <LoaderCircle className="size-4 animate-spin text-muted-foreground" />}
                  {status === "valid" && <CircleCheck className="size-4 text-green-600" />}
                  {status === "invalid" && <Ban className="size-4 text-destructive" />}
                </span>
              </div>
              <FieldError>{errors.username || errorMessage}</FieldError>
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
