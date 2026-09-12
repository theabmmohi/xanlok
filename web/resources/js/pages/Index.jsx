import { Button } from "@/components/ui/button"
import { usePage, router } from "@inertiajs/react"
export default function Index () {
  const { props } = usePage()
  return <pre>{JSON.stringify(props, null, 2)}</pre>
}
