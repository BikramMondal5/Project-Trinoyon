import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function TrendingHashtags() {
  const hashtags = [
    { tag: "#Puja2025", posts: "12.5K posts" },
    { tag: "#DurgaVibes", posts: "8.3K posts" },
    { tag: "#PandalHopping", posts: "5.7K posts" },
    { tag: "#BengaliTradition", posts: "4.2K posts" },
    { tag: "#PujoFashion", posts: "3.9K posts" },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-[#c62828]" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hashtags.map((hashtag) => (
          <div key={hashtag.tag} className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#c62828]">{hashtag.tag}</span>
            <span className="text-xs text-gray-500">{hashtag.posts}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
