import { UserDetails } from '@/components/users/user-details'

export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detalhes do Usuário</h1>
        <p className="text-muted-foreground">Visualize e gerencie as informações do usuário.</p>
      </div>
      <UserDetails id={params.id} />
    </div>
  )
}
