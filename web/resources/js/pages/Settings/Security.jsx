import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { usePasskeyRegister } from "@laravel/passkeys/react"
import { Fingerprint, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { router } from "@inertiajs/react"
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
        <CardTitle>
          <Fingerprint/>
          Passkeys
        </CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <Button processing={loadingPasskey} onClick={registerPasskey}>
          { loadingPasskey ? null : <Plus/> }
          Add new
        </Button>
      </CardFooter>
    </Card>
    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(passkeys, null, 2)}</pre>
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
