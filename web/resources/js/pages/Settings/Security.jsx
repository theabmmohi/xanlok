import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { usePasskeyRegister } from "@laravel/passkeys/react"
import { Fingerprint, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { time, ago } from "@/lib/functions"
import { router } from "@inertiajs/react"

import ConfirmPassword from "@/modals/confirmPassword"
import toast from "@/lib/toaster"

export default function Security ({ passkeys }) {
  const { register: registerPasskey, isLoading: loadingPasskey } = usePasskeyRegister({
    onSuccess: () => {
      toast.success("Passkey added successfully")
      router.reload({ only: ["passkeys"] })
    },
    onError: (error) => toast.error(error?.message ?? "Passkey register failed.")
  })
  return <>
    <Card className="max-w-sm sm:mx-auto mx-5 my-5">
      <CardHeader>
        <CardTitle className="flex gap-2.5">
          <Fingerprint/>
          Passkeys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
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
              <ConfirmPassword onConfirm={() => router.delete(`/user/passkeys/${passkey.id}`)}>
                {(trigger, checking) => <Button size="icon" variant="destructive" processing={checking} onClick={trigger}>{ checking ? null : <Trash/> }</Button>}
              </ConfirmPassword>
              <Button size="icon" variant="destructive"><Trash/></Button>
            </ItemActions>
          </Item>)}
        </ItemGroup>
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <ConfirmPassword onConfirm={() => {
          const name = window.prompt("Enter Passkey Name")
          registerPasskey(name)
        }}>
        {(trigger, checking) => <Button processing={checking || loadingPasskey} onClick={trigger}>
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
