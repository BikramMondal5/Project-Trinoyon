import { Home, ImageIcon, MessageCircle, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white md:hidden">
      <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
        <Home className="h-5 w-5" />
        <span className="mt-1 text-[10px]">Home</span>
      </Button>
      <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
        <Search className="h-5 w-5" />
        <span className="mt-1 text-[10px]">Search</span>
      </Button>
      <Button
        size="icon"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#c62828] to-[#f9a825] text-white shadow-lg"
      >
        <ImageIcon className="h-6 w-6" />
        <span className="sr-only">Create Post</span>
      </Button>
      <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
        <MessageCircle className="h-5 w-5" />
        <span className="mt-1 text-[10px]">Messages</span>
      </Button>
      <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
        <User className="h-5 w-5" />
        <span className="mt-1 text-[10px]">Profile</span>
      </Button>
    </div>
  )
}
