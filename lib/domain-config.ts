/**
 * Configuration for the application domain.
 * Defines the expert persona and content structure.
 */
export interface DomainConfig {
  domain: string;
  expertRole: string;
  moduleCount: number;
  inputLabel: string;
  inputPlaceholder: string;
  appName: string;
  tagline: string;
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
