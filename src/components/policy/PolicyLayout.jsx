"use client";

import PolicySidebar from "./PolicySidebar";
import PolicyContent from "./PolicyContent";
import usePolicyScroll from "./usePolicyScroll";

export default function PolicyLayout({ data }) {
  const sections = Object.entries(data)
    .filter(([key]) => key.endsWith("Section"))
    .map(([key]) => ({
      id: key.replace("Section", "").toLowerCase(),
      key,
    }));

  const { activeSection, scrollToSection } = usePolicyScroll(data.sections);

  return (
    <div className="container mx-auto px-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <PolicySidebar
          sections={data.sections}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />

        <PolicyContent data={data} />
      </div>
    </div>
  );
}
