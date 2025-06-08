"use client"

import { useState } from "react"
import { BadgeCheck, MoreHorizontal, MessageCircle, Share2, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostCardProps {
  user: {
    name: string
    image: string
    verified?: boolean
  }
  timestamp: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
}

export function PostCard({ user, timestamp, content, image, likes, comments, shares }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-semibold">{user.name}</span>
              {user.verified && <BadgeCheck className="ml-1 h-4 w-4 text-[#c62828]" />}
            </div>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Follow {user.name}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap text-sm">{content}</p>
        {image && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img src={image || "/placeholder.svg"} alt="Post image" className="h-auto w-full object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center justify-between border-t border-b p-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ThumbsUp className="h-3 w-3 fill-[#c62828] text-[#c62828]" />
            <span>{likeCount}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
            <button onClick={() => setShowComments(!showComments)} className="hover:underline">
              {comments} comments
            </button>
            <span>{shares} shares</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${liked ? "text-[#c62828]" : "text-gray-600"}`}
            onClick={handleLike}
          >
            <ThumbsUp className={`mr-1 h-4 w-4 ${liked ? "fill-[#c62828]" : ""}`} />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="border-t p-3">
            <div className="mb-3 space-y-3">
              <div className="flex gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" alt="Commenter" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="rounded-xl bg-gray-100 p-2">
                  <p className="text-xs font-semibold">Riya Das</p>
                  <p className="text-xs">Looking beautiful! Which pandal is this?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" alt="Commenter" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="rounded-xl bg-gray-100 p-2">
                  <p className="text-xs font-semibold">Amit Roy</p>
                  <p className="text-xs">The decorations look amazing! 🙏</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Input placeholder="Write a comment..." className="h-8 text-xs" />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
