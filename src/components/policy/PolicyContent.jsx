import PolicySection from "./PolicySection";

export default function PolicyContent({ data }) {
  return (
    <main className="md:col-span-9 space-y-16 mb-10">
      <div className="space-y-8 mt-4">
        <h2 className="font-medium">{data.meta.title}</h2>

        <h2 className="font-light !text-[1rem] text-gray-400 mb-20">
          Last Updated On: {data.meta.lastUpdated}
        </h2>
      </div>

      {data.sections.map((section) => (
        <PolicySection key={section.id} section={section} />
      ))}
    </main>
  );
}
