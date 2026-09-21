import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { usePasskeyRegister } from "@laravel/passkeys/react"
import { time, ago, guessDevice } from "@util/function"
import { Fingerprint, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"

import ConfirmPassword from "@modal/confirmPassword"
import toast from "@util/toaster"

export default function Security ({ passkeys }) {
  const [passkeyName, setPasskeyName] = useState("")
  const { register: registerPasskey, isLoading: loadingPasskey } = usePasskeyRegister({
    onSuccess: () => {
      toast.success("Passkey added successfully")
      router.reload({ only: ["passkeys"] })
    },
    onError: (error) => toast.error(error?.message ?? "Passkey register failed.")
  })
  useEffect(() => guessDevice().then((deviceName) => setPasskeyName(deviceName)), [])
  return <>
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

    { /*
    <Card className="max-w-sm sm:mx-auto mx-5 my-5">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <Button>Save</Button>
      </CardFooter>
    </Card>
    */ }
  </>
}
