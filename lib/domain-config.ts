/** Domain configuration definitions and the active config exported for app-wide use. */
export interface DomainConfig {
  /** Human-readable name of the subject domain (e.g. 'Indian Election Process'). */
  domain: string;
  /** The AI persona string injected into every system prompt (e.g. 'ECI Education Specialist'). */
  expertRole: string;
  /** Number of learning modules the Builder agent should generate. */
  moduleCount: number;
  /** Label displayed above the topic input field in the UI. */
  inputLabel: string;
  /** Placeholder text shown inside the topic input field. */
  inputPlaceholder: string;
  /** Display name of the application shown in headings and metadata. */
  appName: string;
  /** Short marketing tagline shown beneath the app name. */
  tagline: string;
  /** Suggested topic chips shown to the user on the landing page. */
  topics: string[];
}

/**
 * The currently active configuration for the application.
 * Defaults to Indian Election Education.
 */
export const ACTIVE_CONFIG: DomainConfig = {
  domain: 'Indian Election Process',
  expertRole: 'Election Commission of India (ECI) Education Specialist',
  moduleCount: 4,
  inputLabel: 'Election Topic',
  inputPlaceholder: 'e.g., Model Code of Conduct, EVM handling, Voter Rights...',
  appName: 'ElectEd',
  tagline: 'Empowering Citizens through Election Literacy',
  topics: ['Model Code of Conduct', 'EVM Security', 'Voter Registration', 'Polling Station Rules', 'Counting Process'],
};

/*
// Domain Variant: Space Exploration
export const SPACE_CONFIG: DomainConfig = {
  domain: 'Space Exploration',
  expertRole: 'ISRO Mission Specialist',
  moduleCount: 6,
  inputLabel: 'Mission Phase',
  inputPlaceholder: 'e.g., Rocket Launch, Orbit Insertion, Rover Deployment...',
  appName: 'SpaceGuide',
  tagline: 'Journey Through the Cosmos',
};

// Domain Variant: Public Health
export const HEALTH_CONFIG: DomainConfig = {
  domain: 'Public Health',
  expertRole: 'WHO Health Educator',
  moduleCount: 6,
  inputLabel: 'Health Topic',
  inputPlaceholder: 'e.g., Vaccination, Nutrition, Hygiene Practices...',
  appName: 'HealthWise',
  tagline: 'Your Guide to Better Living',
};

// Domain Variant: Environmental Science
export const ECO_CONFIG: DomainConfig = {
  domain: 'Environmental Science',
  expertRole: 'Climate Scientist',
  moduleCount: 6,
  inputLabel: 'Environmental Issue',
  inputPlaceholder: 'e.g., Carbon Sequestration, Renewable Energy, Biodiversity...',
  appName: 'EcoLearn',
  tagline: 'Protecting Our Planet Together',
};
*/
