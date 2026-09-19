import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePage, useForm } from "@inertiajs/react"
import { Save, RefreshCw } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { down } from "@/lib/functions"
import toast from "@/lib/toaster"

export default function Profile () {
  const { props } = usePage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const profileForm = useForm({ name: props.auth.user?.name, email: props.auth.user?.email })
  const change = (field, event) => {
    const value = event.target.value
    profileForm.setData(field, value)
    profileForm.clearErrors(field)
  }
  const save = () => profileForm.put("/user/profile-information", {
    preserveScroll: true,
    errorBag: "updateProfileInformation",
    onSuccess: () => toast.success("Profile information updated.")
  })
  const submit = (event) => {
    event.preventDefault()
    down()
    if(profileForm.data.email !== props.auth.user?.email) {
      setDialogOpen(true)
      return
    }
    save()
  }
  const avatarForm = useForm({ avatar: null })
  const fileRef = useRef(null)
  const pick = () => fileRef.current?.click()
  const upload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB image allowed.")
      event.target.value = ""
      return
    }
    avatarForm.transform(() => ({ avatar: file }))
    avatarForm.post("/user/avatar", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => toast.success("Avatar updated."),
      onError: (error) => toast.error(error.avatar),
      onFinish: () => { event.target.value = "" }
    })
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
          <input type="file" accept="image/*" ref={fileRef} onChange={upload} hidden/>
          <Button processing={avatarForm.processing} type="button" onClick={pick}>
            { avatarForm.processing ? null : <RefreshCw/> }
            Change
          </Button>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" value={profileForm.data.name} onChange={(event) => change("name", event)} aria-invalid={!!profileForm.errors.name}/>
            <FieldError>{profileForm.errors.name}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="name@example.com" value={profileForm.data.email} onChange={(event) => change("email", event)} aria-invalid={!!profileForm.errors.email}/>
            <FieldError>{profileForm.errors.email}</FieldError>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <Button processing={profileForm.processing} type="submit">
          { profileForm.processing ? null : <Save/> }
          Save
        </Button>
      </CardFooter>
    </Card>
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} className="max-w-sm sm:mx-auto mx-5 my-5">
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change your email address?</AlertDialogTitle>
          <AlertDialogDescription render={<div/>}>
            Changing your email involves a 3-step security process:
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-left">
              <li><strong>Approve the request:</strong> A link will be sent to <strong>{props.auth.user?.email}</strong>. If you deny it, nothing changes.</li>
              <li><strong>Log in with new email:</strong> Once approved from your <strong>{props.auth.user?.email}</strong> inbox, your email updates immediately to <strong>{profileForm.data.email}</strong>, allowing you to sign in.</li>
              <li><strong>Verify the new address:</strong> Your new email will remain "unverified" until you click the confirmation link sent to your {profileForm.data.email} inbox.</li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t change</AlertDialogCancel>
          <AlertDialogAction onClick={() => { setDialogOpen(false); save() }}>I understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </form>
}
