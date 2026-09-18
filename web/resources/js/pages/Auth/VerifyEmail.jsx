import { usePage } from "@inertiajs/react"
import { Inbox } from "lucide-react"

export default function VerifyEmail () {
  const { props } = usePage()
  return <div className="max-w-sm sm:mx-auto mx-5 my-5 flex flex-col items-center text-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="rounded-full bg-secondary p-10">
      <Inbox className="size-20 text-secondary-foreground"/>
    </div>
    <div className="flex flex-col gap-1">
      <p className="font-medium text-foreground">Check your inbox!</p>
      <p className="text-muted-foreground">We sent a verification link to {props.auth.user.email}</p>
      <p className="text-sm text-muted-foreground mt-1">You can already use this email to log in</p>
    </div>
  </div>
}
