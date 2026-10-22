import { describe, expect, it } from "vitest";
import { proficiencyToBloom, scoreToCriticality } from "@/lib/companyData";
import { loadCompanyProfile, loadCompanySkills, loadCompanySummaries } from "@/data/seedFallback";
import { buildIntelligenceSections } from "@/data/intelligenceData";

describe("Phase 1 seed data smoke test", () => {
  it("normalizes the Accenture seed record end-to-end", () => {
    const [company] = loadCompanySummaries();
    expect(company.shortName).toBe("Accenture");
    expect(company.companyType).toBe("Dream");

    const profile = loadCompanyProfile(company.id)!;
    const sections = buildIntelligenceSections(profile);
    expect(sections).toHaveLength(22);
    expect(sections[0].title).toBe("Company Identity");
    expect(sections[21].title).toBe("Contact Information");

    const skills = loadCompanySkills(company.id);
    expect(skills).toHaveLength(12);
    expect(skills[0].score).toBeGreaterThanOrEqual(skills[11].score);
    expect(skills.every((s) => s.topics.length === 10)).toBe(true);
  });

  it("maps proficiency and criticality per spec", () => {
    expect(proficiencyToBloom(2)).toBe("CU");
    expect(proficiencyToBloom(7)).toBe("EV");
    expect(proficiencyToBloom(10)).toBe("CR");
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
  });

  it("never exposes CTC, stipend or selection ratio keys", () => {
    const [company] = loadCompanySummaries();
    const keys = Object.keys(loadCompanyProfile(company.id)!).join(" ");
    expect(keys).not.toMatch(/ctc|stipend|selection_ratio/i);
  });
});
