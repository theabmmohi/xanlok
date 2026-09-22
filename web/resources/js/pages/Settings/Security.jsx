import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Fingerprint, Trash, Plus, RectangleEllipsis } from "lucide-react"
import { down, time, ago, guessDevice } from "@util/function"
import { usePasskeyRegister } from "@laravel/passkeys/react"
import { router, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

import ConfirmPassword from "@modal/confirmPassword"
import toast from "@util/toaster"

export default function Security ({ passkeys }) {
  const [passkeyName, setPasskeyName] = useState("")
  const updatePassForm = useForm({ current_password: "", password: "", password_confirmation: "" })
  const { register: registerPasskey, isLoading: loadingPasskey } = usePasskeyRegister({
    onSuccess: () => {
      toast.success("Passkey added successfully")
      router.reload({ only: ["passkeys"] })
    },
    onError: (error) => toast.error(error?.message ?? "Passkey register failed.")
  })
  const change = (field, event) => {
    const value = event.target.value
    updatePassForm.setData(field, value)
    updatePassForm.clearErrors(field)
  }
  const submit = (event) => {
    event.preventDefault()
    down()
    updatePassForm.put("/user/password", {
      preserveScroll: true,
      errorBag: "updatePassword",
      onSuccess: () => {
        updatePassForm.reset()
        toast.success("Password updated.")
      }
    })
  }
  useEffect(() => {
    (async () => {
      const deviceName = await guessDevice()
      setPasskeyName(deviceName)
    })()
  }, [])
  return <>
    <Card className="max-w-sm sm:mx-auto mx-5 my-5">
      <CardHeader>
        <CardTitle className="flex gap-2.5">
          <RectangleEllipsis/>
          Update password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={submit}>
          <FieldGroup>
          <Field>
            <FieldLabel htmlFor="current_password">Current password</FieldLabel>
            <Input id="current_password" type="password" placeholder="••••••••" value={updatePassForm.data.current_password} onChange={(event) => change("current_password", event)} aria-invalid={!!updatePassForm.errors.current_password}/>
            <FieldError>{updatePassForm.errors.current_password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" value={updatePassForm.data.password} onChange={(event) => change("password", event)} aria-invalid={!!updatePassForm.errors.password}/>
            <FieldError>{updatePassForm.errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
            <Input id="password_confirmation" type="password" placeholder="••••••••" value={updatePassForm.data.password_confirmation} onChange={(event) => change("password_confirmation", event)} aria-invalid={!!updatePassForm.errors.password_confirmation}/>
            <FieldError>{updatePassForm.errors.password_confirmation}</FieldError>
          </Field>
            <Field>
              <Button processing={updatePassForm.processing} type="submit">Update password</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <Card className="max-w-sm sm:mx-auto mx-5 my-5">
      <CardHeader>
        <CardTitle className="flex gap-2.5">
          <Fingerprint/>
          Passkeys
        </CardTitle>
      </CardHeader>
      <CardContent>
        {passkeys.length === 0 ? <p className="text-sm text-center text-muted-foreground">
          You haven't added any passkeys yet.
        </p> : <ItemGroup>
          {passkeys.map((passkey) => <Item key={passkey.id} variant="outline">
            <ItemContent>
              <ItemTitle>{passkey.name}</ItemTitle>
              <ItemDescription className="line-clamp-3">
                {passkey.authenticator}
                <br/>{passkey.last_used_at ? `Last used ${ago(passkey.last_used_at)}` : "Never used"}
                <br/>Created on {time(passkey.created_at)}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ConfirmPassword onConfirm={() => router.delete(`/user/passkeys/${passkey.id}`, {
                onSuccess: () => toast.success("Passkey deleted"),
                onError: (error) => toast.error(error.message ?? "Failed to delete passkey")
              })}>
                {(trigger, checking) => <Button size="icon" variant="destructive" processing={checking} onClick={trigger}>{ checking ? null : <Trash/> }</Button>}
              </ConfirmPassword>
            </ItemActions>
          </Item>)}
        </ItemGroup>}
      </CardContent>
      <CardFooter className="border-t flex gap-5">
        <form id="addPasskeyForm">
          <Input placeholder="Enter passkey name" value={passkeyName} onChange={(event) => setPasskeyName(event.target.value)} onFocus={(event) => event.target.select()}/>
        </form>
        <ConfirmPassword onConfirm={() => registerPasskey(passkeyName)}>
        {(trigger, checking) => <Button type="submit" form="addPasskeyForm" processing={checking || loadingPasskey} onClick={() => {
          if (!passkeyName) return toast.error("Enter passkey name first")
          trigger()
        }}>
          { checking || loadingPasskey ? null : <Plus/> }
          Add
        </Button>}
        </ConfirmPassword>
      </CardFooter>
    </Card>
  </>
}
