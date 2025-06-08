import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck } from "lucide-react"

export function SuggestedUsers() {
  const users = [
    { name: "Aditya Ghosh", image: "/placeholder.svg", verified: true },
    { name: "Meera Chatterjee", image: "/placeholder.svg", verified: false },
    { name: "Vikram Sen", image: "/placeholder.svg", verified: false },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Suggested Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user) => (
          <div key={user.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-xs font-medium">{user.name}</span>
                {user.verified && <BadgeCheck className="ml-1 h-3 w-3 text-[#c62828]" />}
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Follow
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-xs text-[#c62828]">
          See More
        </Button>
      </CardContent>
    </Card>
  )
}
