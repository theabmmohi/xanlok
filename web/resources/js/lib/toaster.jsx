import { Toaster as Sonner } from "sonner"
export { toast as default } from "sonner"

export function Toaster ({
  theme = "system",
  richColors = false
}) {
  return <Sonner
    theme={theme}
    richColors={richColors}
    swipeDirections={["top"]}
    position="top-center"
    toastOptions={{
      duration: 5000
    }}
  />
}
