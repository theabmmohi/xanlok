import { usePage } from "@inertiajs/react"
import { useEffect } from "react"
import toast from "@/lib/toaster"

export default function Index () {
  const { props } = usePage()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("verified") === "1") {
      toast.success("Email verified successfully!")
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])
  return <>
    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(props, null, 2)}</pre>
  </>
}
