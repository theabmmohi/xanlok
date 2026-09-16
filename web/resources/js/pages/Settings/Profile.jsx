import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePage, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { down } from "@/lib/functions"
import { Pencil } from "lucide-react"

export default function Profile () {
  const { props } = usePage()
  const { data, setData, put, processing, errors, clearErrors } = useForm({ name: props.auth.user?.name, email: props.auth.user?.email })
  const change = (field, event) => {
    const value = event.target.value
    setData(field, value)
    clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    put("/user/profile-information", { errorBag: "updateProfileInformation" })
  }
  return <form noValidate onSubmit={submit}>
    <Card className="max-w-sm sm:mx-auto mx-5 my-5">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <Avatar className="w-1/3 h-auto aspect-square">
            <AvatarImage src={props.auth.user?.avatar} alt={props.auth.user?.name}/>
            <AvatarFallback className="text-5xl">{props.auth.user?.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button type="button">Change</Button>
        </div>
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
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <Button processing={processing} type="submit">Save</Button>
      </CardFooter>
    </Card>
  </form>
}
