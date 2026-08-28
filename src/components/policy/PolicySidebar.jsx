"use client";

export default function PolicySidebar({
  sections = [],
  activeSection,
  onNavigate,
}) {
  if (!sections.length) return null;

  return (
    <aside className="md:col-span-3 mt-0 md:mt-48 mb-0 md:mb-10">
      <ul className="space-y-4 text-sm sticky font-secondary top-[8.75rem]">
        {sections.map((section) => (
          <li
            key={section.id}
            onClick={() => onNavigate(section.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onNavigate(section.id);
              }
            }}
            className={`cursor-pointer border-l-2 pl-4 transition-colors duration-200
              ${
                activeSection === section.id
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${section.title}`}
          >
            {section.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
