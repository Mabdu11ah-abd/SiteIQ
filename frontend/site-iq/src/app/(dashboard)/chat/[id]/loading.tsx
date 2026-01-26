import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="text-center">
                <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading chat...</p>
            </div>
        </div>
    )
}
