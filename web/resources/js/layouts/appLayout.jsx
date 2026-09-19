import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { BadgeCheck, BadgeAlert, BadgeQuestionMark, Sun, Moon, Monitor, Settings, LogOut, Info, User, Lock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useCallback } from "react"
import { usePage, router, Link } from "@inertiajs/react"
import { Github } from "@thesvg/react"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "@/lib/toaster"

export default function AppLayout({ children }) {
  const { component, props } = usePage()
  const [appearance, setAppearanceState] = useState("")
  const [sysDark, setSysDark] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
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
  useEffect(() => {
    Object.entries(props.flash).forEach(([key, msg]) => {
      if (!msg) return
      const fn = typeof toast[key] === "function" ? toast[key] : toast.info
      fn(msg)
    })
  }, [props.flash])
  const EmailIcon = props.auth.email?.verified ? BadgeCheck : BadgeAlert
  return <>
    <header className="px-5 py-2 sticky top-0 z-999 flex items-center justify-between border-border border-b bg-secondary select-none">
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
                  <div>
                    <p className="text-sm font-medium truncate">{props.auth.user?.name}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="flex-1 text-xs text-muted-foreground truncate">{props.auth.user?.email}</p>
                    <EmailIcon size={16} className={props.auth.email?.verified ? "text-green-400" : "text-destructive"}/>
                  </div>
                  {props.auth.email?.pending && <div className="flex items-center">
                    <p className="flex-1 text-xs text-muted-foreground truncate">{props.auth.email?.pending}</p>
                    <BadgeQuestionMark size={16} className="text-destructive"/>
                  </div>}
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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
                    <DropdownMenuSubContent className="min-w-50">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuItem render={<Link href="/settings/profile"/>}>
                          <User/>Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/settings/security"/>}>
                          <Lock/>Security
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Info/>About {props.appname}
                    </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="min-w-50">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{props.appname}</DropdownMenuLabel>
                        <DropdownMenuItem render={<a href="https://github.com/theabmmohi/xanlok" target="_blank" rel="noopener noreferrer"/>}>
                          <Github variant="mono"/>Github
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => setDialogOpen(true)}>
                  <LogOut/>Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>:
          <div className="h-full flex items-center gap-3">
            <Button nativeButton={false} variant="ghost" render={<Link href="/login"/>}>Login</Button>
            <Button nativeButton={false} variant="outline" render={<Link href="/register"/>}>Register</Button>
          </div>}
      </div>}
    </header>
    <main className="p-5 overflow-x-hidden">{children}</main>
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} className="max-w-sm sm:mx-auto mx-5 my-5">
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to log out?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => { setDialogOpen(false); router.post("/logout") }}>Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Toaster theme={appearance} richColors={!isDark}/>
  </>
}
