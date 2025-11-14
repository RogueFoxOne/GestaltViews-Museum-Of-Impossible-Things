export default function ExhibitGallery() {
  const exhibits = [
    { title: "VibeCoder v2.0", description: "AI-powered coding assistant" },
    { title: "Personal Language Key", description: "Consciousness-serving framework" },
    { title: "Bucket Drops", description: "Neurodivergent-friendly note system" }
  ]

  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Exhibits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {exhibits.map((exhibit, i) => (
          <div key={i} className="p-6 rounded-lg bg-gray-900 hover:bg-gray-800 transition">
            <h3 className="text-2xl font-bold mb-2">{exhibit.title}</h3>
            <p className="text-gray-400">{exhibit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
