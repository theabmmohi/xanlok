import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { usePasskeyRegister } from "@laravel/passkeys/react"
import { Button } from "@/components/ui/button"

export default function Security ({ passkeys }) {
  return <Card className="max-w-sm sm:mx-auto mx-5 my-5">
    <CardHeader>
      <CardTitle>Security</CardTitle>
      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent>
      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(passkeys, null, 2)}</pre>
    </CardContent>
    <CardFooter className="border-t flex justify-end">
      <Button>Save</Button>
    </CardFooter>
  </Card>
}
