import { Button } from "@/components/ui/button"
import { usePage, router } from "@inertiajs/react"
export default function Index () {
  const { props } = usePage()
  return <>
    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(props, null, 2)}</pre>
  </>
}
