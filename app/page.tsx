import Link from "next/link";

export default function Home() {
  return (
<div className="w-screen h-screen bg-black flex justify-center items-center text-white">
  <div className="w-full max-w-[400w] mx-auto">
    <h1 className="text-6xl font-bold mb-4">Hello World</h1>
    <p className="text-2xl text-white/60 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
    <div>
      <Link href="/journal">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Button
      </button>
      </Link>
    </div>
  </div>

</div>
  )
}
