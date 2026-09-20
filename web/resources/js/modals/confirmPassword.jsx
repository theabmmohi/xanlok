import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "@/lib/toaster"

export default function ConfirmPassword ({ onConfirm, children }) {
  const [open, setOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const passwordForm = useForm({ password: "" })
  const trigger = async () => {
    setProcessing(true)
    try {
      const resp = await fetch("/user/confirmed-password-status")
      if (!resp.ok) throw new Error()
      const status = await resp.json()
      if (status.confirmed) {
        onConfirm()
        return
      }
      setOpen(true)
    } catch (error) {
      toast.error(error.message ?? "Something went wrong, please try again.")
    } finally { setProcessing(false) }
  }
  const confirm = (event) => {
    event.preventDefault()
    passwordForm.post("/user/confirm-password", {
      onSuccess: () => {
        setOpen(false)
        onConfirm()
      },
      onError: (error) => toast.error(error.password),
      onFinish: () => passwordForm.reset("password")
    })
  }
  return <>
    {children(trigger, processing)}
    <Dialog open={open} onOpenChange={setOpen} className="max-w-sm sm:mx-auto mx-5 my-5">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your password</DialogTitle>
          <DialogDescription>This is a security-sensitive action. Please re-enter your password to continue.</DialogDescription>
        </DialogHeader>
        <form id="form" onSubmit={confirm}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" value={passwordForm.data.password} onChange={(event) => { passwordForm.setData("password", event.target.value); passwordForm.clearErrors("password") }} aria-invalid={!!passwordForm.errors.password} autoFocus/>
              <FieldError>{passwordForm.errors.password}</FieldError>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="submit" form="form" processing={passwordForm.processing}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
}
