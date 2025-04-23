import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="bg-black bg-opacity-50 p-8 rounded-xl text-center max-w-xl text-white">
        <h1 className="text-4xl md:text-3xl font-bold mb-4">Welcome to Our Product</h1>
        <p className="text-lg md:text-xl mb-6">Discover a new way to connect, create, and grow with us.</p>
        <Button variant="default" size="lg">Get Started</Button>
      </div>
    </main>
  )
}
