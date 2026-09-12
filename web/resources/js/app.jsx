import { createInertiaApp } from "@inertiajs/react"
import AppLayout from "@/layouts/AppLayout"
import "@/app.css"

createInertiaApp({
  strictMode: true,
  layout: () => AppLayout,
  title: (title, page) => {
    const base = page.props.appname
    if (title) return `${title} - ${base}`
    const [pathname] = page.url.split("?")
    const segs = pathname.split("/").filter(Boolean).map(seg => seg.charAt(0).toUpperCase() + seg.slice(1))
    return segs.length ? `${segs.join(" | ")} - ${base}` : base
  },
  progress: {
    color: "#4B5563"
  }
})
