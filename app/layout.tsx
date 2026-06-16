// Canonical 2026-06-16: minimal layout. No @theokit/ui dependency.
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>theokit-example</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  )
}
