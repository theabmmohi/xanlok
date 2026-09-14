import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Security () {
  return <main className="p-10">
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="border-t flex justify-end">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  </main>
}
