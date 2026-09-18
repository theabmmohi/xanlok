import { Toaster as Sonner } from "sonner"
export { toast as default } from "sonner"

export function Toaster ({
  theme = "system",
  richColors = false
}) {
  return <Sonner
    theme={theme}
    richColors={richColors}
    swipeDirections={["left", "right"]}
    position="bottom-center"
    toastOptions={{
      duration: 5000
    }}
  />
}
