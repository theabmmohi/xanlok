import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePage } from "@inertiajs/react"

export default function Profile () {
  const { props } = usePage()
  return <Card className="max-w-sm mx-auto my-5">
    <CardHeader>
      <CardTitle>Profile</CardTitle>
      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent>
      <div>
        <Avatar className="w-1/3 h-auto aspect-square">
          <AvatarImage src={props.auth.user?.avatar} alt={props.auth.user?.name}/>
          <AvatarFallback className="text-5xl">{props.auth.user?.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </CardContent>
    <CardFooter className="border-t flex justify-end">
      <Button>Save</Button>
    </CardFooter>
  </Card>
}
