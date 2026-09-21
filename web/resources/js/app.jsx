import { createInertiaApp } from "@inertiajs/react"
import AppLayout from "@util/appLayout"
import "@/app.css"

createInertiaApp({
  strictMode: true,
  layout: () => AppLayout,
  title: (title, page) => {
    const base = page.props.appname
    if (title) return `${title} - ${base}`
    const [pathname] = page.url.split("?")
    const segs = pathname
      .split("/")
      .filter(Boolean)
      .map(seg =>
        seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, char => char.toUpperCase())
      )
    return segs.length ? `${segs.reverse().join(" | ")} - ${base}` : base
  },
  progress: {
    color: "#EA580C"
  }
})
