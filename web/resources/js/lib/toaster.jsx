import { Toaster as Sonner, toast } from "sonner"

export default toast
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
