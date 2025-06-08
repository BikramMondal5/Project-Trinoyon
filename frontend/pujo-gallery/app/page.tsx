"use client"

import { useState } from "react"
import { Bell, Home, ImageIcon, MessageCircle, Search, Settings, ThumbsUp, TrendingUp, User, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { MobileNavigation } from "@/components/mobile-navigation"
import { PostCard } from "@/components/post-card"
import { SuggestedUsers } from "@/components/suggested-users"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { SponsoredBanner } from "@/components/sponsored-banner"
import { UserDropdown } from "@/components/user-dropdown"

export default function PujoGallery() {
  const [postText, setPostText] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-gradient-to-r from-[#c62828] to-[#f9a825]"></div>
            <h1 className="hidden text-xl font-bold text-[#c62828] md:block">Pujo Gallery</h1>
          </div>
        </div>

        <div className="relative mx-4 hidden flex-1 max-w-md md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-8" placeholder="Search moments, users, hashtags..." />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#c62828]"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <UserDropdown />
        </div>
      </header>

      <div className="container mx-auto flex max-w-7xl gap-4 px-4 py-4 md:px-6">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && (
          <aside
            className={cn(
              "sticky top-20 hidden h-[calc(100vh-5rem)] w-56 flex-col gap-1 self-start md:flex",
              isTablet && "w-14",
            )}
          >
            <Button variant="ghost" className="justify-start gap-3">
              <Home className="h-5 w-5" />
              {!isTablet && <span>Home</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <Search className="h-5 w-5" />
              {!isTablet && <span>Explore</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <ImageIcon className="h-5 w-5" />
              {!isTablet && <span>Create Post</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <TrendingUp className="h-5 w-5" />
              {!isTablet && <span>Trending</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <User className="h-5 w-5" />
              {!isTablet && <span>My Posts</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <ThumbsUp className="h-5 w-5" />
              {!isTablet && <span>Saved</span>}
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <Settings className="h-5 w-5" />
              {!isTablet && <span>Settings</span>}
            </Button>
          </aside>
        )}

        {/* Main Feed */}
        <main className="flex-1 space-y-4">
          {/* Post Composer */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your Puja moment..."
                  className="min-h-[80px] resize-none border-none p-0 focus-visible:ring-0"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#c62828]">
                      <ImageIcon className="mr-1 h-4 w-4" />
                      Image
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#c62828]">
                      <Video className="mr-1 h-4 w-4" />
                      Video
                    </Button>
                  </div>
                  <Button className="bg-[#c62828] hover:bg-[#b71c1c]" disabled={!postText.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            <PostCard
              user={{
                name: "Anusha Sharma",
                image: "/placeholder.svg",
                verified: true,
              }}
              timestamp="2 hours ago"
              content="Celebrating the first day of Durga Puja with my family! The pandal decorations this year are absolutely stunning. #DurgaPuja2025 #PujoVibes"
              image="/placeholder.svg?height=400&width=600"
              likes={124}
              comments={18}
              shares={5}
            />

            <PostCard
              user={{
                name: "Rahul Banerjee",
                image: "/placeholder.svg",
                verified: false,
              }}
              timestamp="5 hours ago"
              content="The dhak beats are in the air! Can't wait for the evening aarti. Who else is visiting Ballygunge Puja today?"
              likes={87}
              comments={32}
              shares={3}
            />

            <PostCard
              user={{
                name: "Priya Mukherjee",
                image: "/placeholder.svg",
                verified: true,
              }}
              timestamp="Yesterday"
              content="Traditional saree day! Ready for pandal hopping with friends. Durga Maa's blessings to everyone!"
              image="/placeholder.svg?height=400&width=600"
              likes={215}
              comments={42}
              shares={12}
            />
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        {!isMobile && !isTablet && (
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-72 flex-col gap-4 self-start overflow-auto lg:flex">
            <SuggestedUsers />
            <TrendingHashtags />
            <SponsoredBanner />
          </aside>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
    </div>
  )
}
