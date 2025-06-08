import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

export function SponsoredBanner() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#c62828] to-[#f9a825] pb-2 text-white">
        <CardTitle className="text-sm font-medium">Support Pujo Celebrations</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3 space-y-2">
          <p className="text-xs">Help fund local pandals and cultural events.</p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[65%] bg-gradient-to-r from-[#c62828] to-[#f9a825]"></div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>₹65,000 raised</span>
            <span>₹100,000 goal</span>
          </div>
        </div>
        <Button className="w-full bg-[#c62828] text-xs hover:bg-[#b71c1c]">
          <Gift className="mr-1 h-4 w-4" />
          Donate Now
        </Button>
      </CardContent>
    </Card>
  )
}
