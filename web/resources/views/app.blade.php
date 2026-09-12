<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="theme-color" content="#ffffff">
    @env("local")
      <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init()</script>
    @endenv
    <script>
      (() => {
        try {
          if (!localStorage.getItem("appearance")) localStorage.setItem("appearance", "system")
          const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const current = localStorage.getItem("appearance")
          if (current === "dark" || (current === "system" && sysDark)) {
            document.documentElement.classList.add("dark")
            const meta = document.querySelector('meta[name="theme-color"]')
            if (meta) meta.setAttribute("content", "#09090b")
          }
        } catch (_) {}
      })()
    </script>
    @viteReactRefresh
    @vite("resources/js/app.jsx")
    <x-inertia::head/>
  </head>
  <body>
    <x-inertia::app/>
  </body>
</html>
