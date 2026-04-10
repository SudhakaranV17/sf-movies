import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_session')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_session"!</div>
}
