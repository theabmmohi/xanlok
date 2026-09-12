import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Monitor, Settings, LogOut, User, Lock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useCallback } from "react"
import { usePage, router, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "@/lib/toaster"

export default function AppLayout({ children }) {
  const { component, props } = usePage()
  const [appearance, setAppearanceState] = useState("")
  const [sysDark, setSysDark] = useState(false)
  useEffect(() => {
    setAppearanceState(localStorage.getItem("appearance"))
    setSysDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handle = (e) => setSysDark(e.matches)
    mql.addEventListener("change", handle)
    return () => mql.removeEventListener("change", handle)
  }, [])
  const isDark = appearance === "dark" || (appearance === "system" && sysDark)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute("content", isDark ? "#09090b" : "#ffffff")
  }, [isDark])
  const setAppearance = useCallback((value) => {
    if (appearance === value) return
    localStorage.setItem("appearance", value)
    setAppearanceState(value)
    toast.info(`Appearance switched to ${value}.`)
  }, [appearance])
  return <>
    <div className="h-svh w-svw flex flex-col">
      <div className="flex items-center justify-between bg-secondary border-b border-border px-5 py-2 select-none">
        <div onClick={() => router.get("/")}>
          <span className="font-mono text-lg font-medium text-secondary-foreground">{props.appname}</span>
        </div>
        {component.startsWith("Auth/") ? <div className="h-10"></div> : <div className="h-10">
          {props.auth.user?
            <DropdownMenu>
              <DropdownMenuTrigger nativeButton={false} render={
                <Avatar size="lg" className="cursor-pointer">
                  <AvatarImage src={props.auth.user?.avatar} alt={props.auth.user?.name}/>
                  <AvatarFallback>{props.auth.user?.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
                </Avatar>
              }/>
              <DropdownMenuContent className="min-w-50">
                <DropdownMenuGroup>
                  <div className="p-1 select-none">
                    <p className="text-sm font-medium truncate">{props.auth.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{props.auth.user?.email}</p>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="select-none">Appearance</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={appearance} onValueChange={setAppearance}>
                    <DropdownMenuRadioItem value="light">
                      <Sun/>Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon/>Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor/>System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Settings/>Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem render={<Link href="/settings/profile"/>}>
                          <User/>Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/settings/security"/>}>
                          <Lock/>Security
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem variant="destructive" onClick={() => router.post("/logout")}>
                    <LogOut/>Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>:
            <div className="h-full flex items-center gap-3">
              <Button nativeButton={false} variant="ghost" render={<Link href="/login"/>}>Login</Button>
              <Button nativeButton={false} variant="outline" className="bg-transparent" render={<Link href="/register"/>}>Register</Button>
            </div>}
        </div>}
      </div>
      <div className="flex-1 min-h-full w-full overflow-y-auto p-6">
        {children}
      </div>
    </div>
    <Toaster theme={appearance} richColors={!isDark}/>
  </>
}
