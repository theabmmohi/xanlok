import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { usePasskeyVerify } from "@laravel/passkeys/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Fingerprint } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { down } from "@util/function"
import { useState } from "react"

import toast from "@util/toaster"

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
    down()
    passwordForm.post("/user/confirm-password", {
      onSuccess: () => {
        setOpen(false)
        onConfirm()
      },
      onError: (error) => toast.error(error.password),
      onFinish: () => passwordForm.reset("password")
    })
  }
  const { verify: verifyPasskey, isLoading: loadingPasskey } = usePasskeyVerify({
    routes: {
      options: "/passkeys/confirm/options",
      submit: "/passkeys/confirm",
    },
    onSuccess: () => {
      setOpen(false)
      onConfirm()
    },
    onError: (error) => toast.error(error?.message ?? "Passkey confirmation failed.")
  })
  return <>
    {children(trigger, processing)}
    <Dialog className="max-w-sm sm:mx-auto mx-5 my-5" open={open} disablePointerDismissal onOpenChange={(isOpen, _, eDetails) => {
      if (!isOpen && eDetails?.reason === "escape-key") return
      setOpen(isOpen)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your password</DialogTitle>
          <DialogDescription>This is a security-sensitive action. Please re-enter your password to continue.</DialogDescription>
        </DialogHeader>
        <form id="confirmPasswordForm" onSubmit={confirm}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" value={passwordForm.data.password} onChange={(event) => { passwordForm.setData("password", event.target.value); passwordForm.clearErrors("password") }} aria-invalid={!!passwordForm.errors.password} autoFocus/>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter className="flex-col">
          <Button type="submit" form="confirmPasswordForm" processing={passwordForm.processing}>Confirm</Button>
          <Button type="button" variant="outline" processing={loadingPasskey} onClick={verifyPasskey}>
            { loadingPasskey ? null : <Fingerprint/> }
            Continue with passkey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
}
