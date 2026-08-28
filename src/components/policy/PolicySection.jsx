export default function PolicySection({ section }) {
  if (!section) return null;

  return (
    <section id={section.id} className="scroll-mt-[11.25rem]">
      <h2 className="text-[26px] font-secondary font-medium mb-4">
        {section.title}
      </h2>

      <div className="space-y-4">
        {section.content.map((block, index) => {
          switch (block.type) {
            case "text":
              return (
                <p key={index} className="text-[1rem] font-secondary">
                  {block.value}
                </p>
              );

            case "html":
              return (
                <div
                  key={index}
                  className="prose prose-sm max-w-none font-secondary !text-[1rem] text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: block.value,
                  }}
                />
              );

            case "list":
              return (
                <ul
                  key={index}
                  className={`ml-6 space-y-1 !text-[1rem] ${
                    block.style === "number" ? "list-decimal" : "list-disc"
                  }`}
                >
                  {block.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );

            case "definition":
              return (
                <div key={index}>
                  <p className="!text-[1rem] font-medium">{block.heading}</p>

                  <ul className="list-disc ml-6 mt-2 space-y-1 !text-[1rem]">
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              );

            case "contact":
              return (
                <div
                  key={index}
                  className="space-y-3 font-secondary mb-10 md:mb-20"
                >
                  {block.emails?.map((email, i) => (
                    <p key={i} className="!text-[1rem]">
                      Email: {email}
                    </p>
                  ))}

                  {block.phones?.map((phone, i) => (
                    <p key={i} className="!text-[1rem]">
                      Phone: {phone}
                    </p>
                  ))}

                  {block.addresses?.map((addr, i) => (
                    <p key={i} className="!text-[1rem]">
                      {addr.label} – {addr.value}
                    </p>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}
