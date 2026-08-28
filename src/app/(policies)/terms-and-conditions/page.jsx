import termsData from "../../../../data/policies/terms-and-conditions.json";
import PolicyLayout from "@/components/policy/PolicyLayout";
// import InnerCTA from "@/components/cta/inner-cta";

export default function TermsAndConditionPage() {
  return (
    <section id="">
      <PolicyLayout data={termsData} />
      {/* <InnerCTA /> */}
    </section>
  );
}
