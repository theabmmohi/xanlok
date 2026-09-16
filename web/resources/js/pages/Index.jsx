import { usePage } from "@inertiajs/react"
import toast from "@/lib/toaster"

export default function Index () {
  const { props } = usePage()
  return <>
    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(props, null, 2)}</pre>
  </>
}
