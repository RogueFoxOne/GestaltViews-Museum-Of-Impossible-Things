// components/demoRegistry.tsx
'use client';

// Original demo components
import VibeCoderDemo from './VibeCoderDemo';
import ResumeRockstarDemo from './ResumeRockstarDemo';
import SymbioCoderDemo from './SymbioCoderDemo';

// New full-page exhibit components, imported to be used as demos
import ValidationWall from './ValidationWall';
import BrainSparksStation from './BrainSparksStation';
import VillageBuildersCovenant from './VillageBuildersCovenant';
import MusicalDNADemo from './MusicalDNADemo';
import EnhancedPLKSystemExhibit from './EnhancedPLKSystemExhibit';
import BillysRoom from './BillysRoom';
import AlzheimersLegacyExhibit from './AlzheimersLegacyExhibit';
import AddictionRecoveryExhibit from './AddictionRecoveryExhibit';
// This registry maps an exhibit's unique ID (in lowercase) to its component.
const registry: Record<string, React.ComponentType> = {
  // Original Demos
  'vibecoder-demo': VibeCoderDemo,
  'resume-rockstar-demo': ResumeRockstarDemo,
  'symbiocoder-demo': SymbioCoderDemo,

  // New Full-Page Exhibit Demos
  'validation-wall': ValidationWall,
  'brain-sparks': BrainSparksStation,
  'village-builders': VillageBuildersCovenant,
  'musical-dna': MusicalDNADemo,
  'personal-language-key': EnhancedPLKSystemExhibit,
  'billys-room': BillysRoom,  
  'alzheimers-legacy': AlzheimersLegacyExhibit,
  'addiction-recovery': AddictionRecoveryExhibit,
};

/**
 * Finds the correct demo component for a given exhibit.
 * @param exhibit - The exhibit object from your data source.
 * @returns The corresponding React component or null if not found.
 */
export function getDemoComponent(exhibit: { id: string } | null): React.ComponentType | null {
  if (!exhibit || !exhibit.id) {
    return null;
  }

  const exhibitId = exhibit.id.toLowerCase();
  return registry[exhibitId] || null;
}
