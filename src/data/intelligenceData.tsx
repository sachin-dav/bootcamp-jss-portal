import {
  Building2,
  Eye,
  Users,
  Landmark,
  Globe2,
  Package,
  Cpu,
  Handshake,
  Swords,
  Target,
  Leaf,
  Coffee,
  Newspaper,
  LineChart,
  ShieldAlert,
  MapPinned,
  HeartPulse,
  GraduationCap,
  Award,
  Wallet,
  Share2,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { CompanyProfile } from "@/lib/companyData";

export type FieldType = "text" | "url" | "video" | "rating" | "list" | "paragraph" | "auto";

export interface IntelligenceField {
  key: string;
  label: string;
  type: FieldType;
  value: string;
}

export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

type FieldDef = [key: string, label: string, type?: FieldType];

interface SectionDef {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: FieldDef[];
}

const SECTION_DEFS: SectionDef[] = [
  {
    id: "identity",
    title: "Company Identity",
    icon: Building2,
    fields: [
      ["name", "Legal Name"],
      ["short_name", "Short Name"],
      ["category", "Category"],
      ["incorporation_year", "Incorporated"],
      ["nature_of_company", "Nature of Company"],
      ["employee_size", "Employee Size"],
      ["headquarters_address", "Headquarters"],
    ],
  },
  {
    id: "overview",
    title: "Overview & Vision",
    icon: Eye,
    fields: [
      ["overview_text", "Overview", "paragraph"],
      ["vision_statement", "Vision", "paragraph"],
      ["mission_statement", "Mission", "paragraph"],
      ["core_values", "Core Values", "list"],
      ["history_timeline", "History & Timeline", "list"],
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Users,
    fields: [
      ["ceo_name", "CEO"],
      ["ceo_linkedin_url", "CEO LinkedIn", "url"],
      ["key_leaders", "Key Leaders", "list"],
      ["board_members", "Board Members", "list"],
      ["warm_intro_pathways", "Warm Intro Pathways", "list"],
      ["decision_maker_access", "Decision-Maker Access", "paragraph"],
    ],
  },
  {
    id: "funding",
    title: "Funding & Financials",
    icon: Landmark,
    fields: [
      ["annual_revenue", "Annual Revenue"],
      ["annual_profit", "Annual Profit"],
      ["revenue_mix", "Revenue Mix", "list"],
      ["valuation", "Valuation"],
      ["yoy_growth_rate", "YoY Growth"],
      ["profitability_status", "Profitability"],
      ["key_investors", "Key Investors", "list"],
      ["recent_funding_rounds", "Recent Funding"],
      ["total_capital_raised", "Total Capital Raised"],
      ["burn_rate", "Burn Rate"],
      ["runway_months", "Runway"],
      ["burn_multiplier", "Burn Multiplier"],
    ],
  },
  {
    id: "global",
    title: "Global Presence",
    icon: Globe2,
    fields: [
      ["operating_countries", "Operating Countries", "list"],
      ["office_count", "Office Count"],
      ["office_locations", "Office Locations", "list"],
    ],
  },
  {
    id: "products",
    title: "Products & Services",
    icon: Package,
    fields: [
      ["offerings_description", "Offerings", "list"],
      ["focus_sectors", "Focus Sectors", "list"],
      ["top_customers", "Top Customers", "list"],
      ["pain_points_addressed", "Pain Points Addressed", "list"],
      ["product_pipeline", "Product Pipeline", "list"],
      ["innovation_roadmap", "Innovation Roadmap", "list"],
      ["case_studies", "Case Studies", "list"],
    ],
  },
  {
    id: "tech",
    title: "Technology Stack",
    icon: Cpu,
    fields: [
      ["tech_stack", "Tech Stack", "list"],
      ["tech_adoption_rating", "Tech Adoption"],
      ["ai_ml_adoption_level", "AI / ML Adoption", "paragraph"],
      ["cybersecurity_posture", "Cybersecurity", "list"],
      ["intellectual_property", "Intellectual Property", "list"],
      ["r_and_d_investment", "R&D Investment"],
      ["automation_level", "Automation Level"],
    ],
  },
  {
    id: "partnerships",
    title: "Partnerships & Ecosystem",
    icon: Handshake,
    fields: [
      ["technology_partners", "Technology Partners", "list"],
      ["partnership_ecosystem", "Partnership Ecosystem", "list"],
      ["industry_associations", "Industry Associations", "list"],
      ["event_participation", "Event Participation", "list"],
    ],
  },
  {
    id: "competitive",
    title: "Competitive Landscape",
    icon: Swords,
    fields: [
      ["key_competitors", "Key Competitors", "list"],
      ["market_share_percentage", "Market Share"],
      ["benchmark_vs_peers", "Benchmark vs Peers", "list"],
      ["competitive_advantages", "Competitive Advantages", "list"],
      ["unique_differentiators", "Unique Differentiators", "list"],
      ["weaknesses_gaps", "Weaknesses & Gaps", "list"],
    ],
  },
  {
    id: "market",
    title: "Market Opportunity",
    icon: Target,
    fields: [
      ["tam", "TAM"],
      ["sam", "SAM"],
      ["som", "SOM"],
      ["future_projections", "Future Projections"],
      ["strategic_priorities", "Strategic Priorities", "list"],
      ["go_to_market_strategy", "Go-to-Market", "list"],
      ["key_challenges_needs", "Key Challenges", "list"],
    ],
  },
  {
    id: "value-esg",
    title: "Core Value Proposition & ESG",
    icon: Leaf,
    fields: [
      ["core_value_proposition", "Core Value Proposition", "list"],
      ["esg_ratings", "ESG Ratings", "list"],
      ["sustainability_csr", "Sustainability & CSR", "list"],
      ["carbon_footprint", "Carbon Footprint"],
      ["ethical_sourcing", "Ethical Sourcing", "list"],
      ["ethical_standards", "Ethical Standards", "list"],
      ["mission_clarity", "Mission Clarity"],
    ],
  },
  {
    id: "culture",
    title: "Culture & Work Life",
    icon: Coffee,
    fields: [
      ["work_culture_summary", "Work Culture", "list"],
      ["manager_quality", "Manager Quality"],
      ["psychological_safety", "Psychological Safety"],
      ["feedback_culture", "Feedback Culture", "list"],
      ["diversity_metrics", "Diversity Metrics", "list"],
      ["diversity_inclusion_score", "Diversity & Inclusion", "list"],
      ["burnout_risk", "Burnout Risk"],
      ["employee_turnover", "Employee Turnover"],
      ["avg_retention_tenure", "Avg. Retention Tenure"],
      ["hiring_velocity", "Hiring Velocity", "list"],
      ["layoff_history", "Layoff History"],
      ["crisis_behavior", "Crisis Behavior"],
    ],
  },
  {
    id: "news",
    title: "Recent News & Milestones",
    icon: Newspaper,
    fields: [
      ["recent_news", "Recent News", "list"],
      ["exit_strategy_history", "Exit Strategy & History", "list"],
    ],
  },
  {
    id: "sales",
    title: "Sales & Customer Metrics",
    icon: LineChart,
    fields: [
      ["sales_motion", "Sales Motion"],
      ["customer_acquisition_cost", "Customer Acquisition Cost"],
      ["customer_lifetime_value", "Customer Lifetime Value"],
      ["cac_ltv_ratio", "CAC : LTV Ratio"],
      ["churn_rate", "Churn Rate"],
      ["net_promoter_score", "Net Promoter Score"],
      ["customer_concentration_risk", "Customer Concentration Risk"],
      ["client_quality", "Client Quality", "list"],
    ],
  },
  {
    id: "risk",
    title: "Risk & Compliance",
    icon: ShieldAlert,
    fields: [
      ["regulatory_status", "Regulatory Status", "list"],
      ["legal_issues", "Legal Issues", "list"],
      ["supply_chain_dependencies", "Supply Chain Dependencies", "list"],
      ["geopolitical_risks", "Geopolitical Risks", "list"],
      ["macro_risks", "Macro Risks", "list"],
    ],
  },
  {
    id: "location",
    title: "Work Location & Commute",
    icon: MapPinned,
    fields: [
      ["remote_policy_details", "Remote Policy"],
      ["typical_hours", "Typical Hours"],
      ["overtime_expectations", "Overtime"],
      ["weekend_work", "Weekend Work"],
      ["flexibility_level", "Flexibility", "list"],
      ["location_centrality", "Location Centrality"],
      ["public_transport_access", "Public Transport", "list"],
      ["cab_policy", "Cab Policy", "list"],
      ["airport_commute_time", "Airport Commute"],
      ["office_zone_type", "Office Zone"],
    ],
  },
  {
    id: "safety",
    title: "Safety & Wellbeing",
    icon: HeartPulse,
    fields: [
      ["area_safety", "Area Safety", "list"],
      ["safety_policies", "Safety Policies", "list"],
      ["infrastructure_safety", "Infrastructure Safety", "list"],
      ["emergency_preparedness", "Emergency Preparedness", "list"],
      ["health_support", "Health Support", "list"],
      ["leave_policy", "Leave Policy", "list"],
    ],
  },
  {
    id: "career",
    title: "Career Growth & Learning",
    icon: GraduationCap,
    fields: [
      ["training_spend", "Training Spend"],
      ["onboarding_quality", "Onboarding"],
      ["learning_culture", "Learning Culture", "list"],
      ["exposure_quality", "Exposure Quality"],
      ["mentorship_availability", "Mentorship", "list"],
      ["internal_mobility", "Internal Mobility"],
      ["promotion_clarity", "Promotion Clarity", "list"],
      ["tools_access", "Tools Access", "list"],
      ["role_clarity", "Role Clarity"],
      ["early_ownership", "Early Ownership"],
      ["work_impact", "Work Impact", "list"],
      ["execution_thinking_balance", "Execution / Thinking Balance"],
      ["cross_functional_exposure", "Cross-Functional Exposure", "list"],
      ["exit_opportunities", "Exit Opportunities", "list"],
      ["skill_relevance", "Skill Relevance"],
      ["network_strength", "Network Strength", "list"],
      ["global_exposure", "Global Exposure", "list"],
    ],
  },
  {
    id: "brand",
    title: "Brand & Reputation",
    icon: Award,
    fields: [
      ["brand_value", "Brand Value"],
      ["company_maturity", "Company Maturity"],
      ["external_recognition", "External Recognition"],
      ["awards_recognitions", "Awards & Recognition", "list"],
      ["brand_sentiment_score", "Brand Sentiment"],
      ["customer_testimonials", "Customer Testimonials", "list"],
      ["marketing_video_url", "Marketing Video", "video"],
    ],
  },
  {
    id: "compensation",
    title: "Compensation & Benefits",
    icon: Wallet,
    fields: [
      ["fixed_vs_variable_pay", "Fixed vs Variable Pay"],
      ["bonus_predictability", "Bonus Predictability"],
      ["esops_incentives", "ESOPs & Incentives", "list"],
      ["family_health_insurance", "Family Health Insurance", "list"],
      ["relocation_support", "Relocation Support", "list"],
      ["lifestyle_benefits", "Lifestyle Benefits", "list"],
    ],
  },
  {
    id: "digital",
    title: "Digital Presence & Ratings",
    icon: Share2,
    fields: [
      ["website_url", "Website", "url"],
      ["website_quality", "Website Quality"],
      ["website_rating", "Website Rating", "rating"],
      ["website_traffic_rank", "Traffic Rank", "list"],
      ["social_media_followers", "Social Followers"],
      ["linkedin_url", "LinkedIn", "url"],
      ["twitter_handle", "Twitter / X"],
      ["facebook_url", "Facebook", "url"],
      ["instagram_url", "Instagram", "url"],
      ["glassdoor_rating", "Glassdoor", "rating"],
      ["indeed_rating", "Indeed", "rating"],
      ["google_rating", "Google", "rating"],
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
    fields: [
      ["primary_contact_email", "Primary Email"],
      ["primary_phone_number", "Primary Phone"],
      ["contact_person_name", "Contact Person"],
      ["contact_person_title", "Contact Title"],
      ["contact_person_email", "Contact Email"],
      ["contact_person_phone", "Contact Phone"],
    ],
  },
];

export function buildIntelligenceSections(profile?: CompanyProfile | null): IntelligenceSection[] {
  return SECTION_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    icon: def.icon,
    fields: def.fields.map(([key, label, type = "auto"]) => ({
      key,
      label,
      type,
      value: profile?.[key] ?? "",
    })),
  }));
}
