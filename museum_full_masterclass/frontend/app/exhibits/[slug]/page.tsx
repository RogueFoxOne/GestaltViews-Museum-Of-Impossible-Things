// app/exhibits/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { MUSEUM_EXHIBITS } from '@/app/data/exhibits'
import dynamic from 'next/dynamic' // ✅ 1. IMPORT DYNAMIC

// Import all possible exhibit components
import VibeCoderDemo from '@/components/VibeCoderDemo'; 
import ResumeRockstarDemo from '@/components/ResumeRockstarDemo'; 
import SymbioCoderDemo from '@/components/SymbioCoderDemo'; 
// import ValidationWall from '@/components/ValidationWall'; // ❌ REMOVE STATIC IMPORT
import BrainSparksStation from '@/components/BrainSparksStation';
import VillageBuildersCovenant from '@/components/VillageBuildersCovenant';
import MusicalDNADemo from '@/components/MusicalDNADemo';
import EnhancedPLKSystemExhibit from '@/components/EnhancedPLKSystemExhibit';
import BillysRoom from '@/components/BillysRoom';
import AlzheimersLegacyExhibit from '@/components/AlzheimersLegacyExhibit';
import AddictionRecoveryExhibit from '@/components/AddictionRecoveryExhibit';
import ADHDPowerUpStation from '@/components/ADHDPowerUpStation';

// ✅ 2. DYNAMICALLY IMPORT VALIDATIONWALL WITH SSR DISABLED
const ValidationWall = dynamic(() => import('@/components/ValidationWall'), {
  ssr: false,
  loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-slate-950"><LoadingSpinner /></div>,
});


// Mapping from SLUG to component
const exhibitComponentMap: Record<string, React.ComponentType> = {
  'vibecoder-demo': VibeCoderDemo,
  'resume-rockstar-demo': ResumeRockstarDemo,
  'symbiocoder-demo': SymbioCoderDemo,
  'validation-wall': ValidationWall, // ✅ 3. ENSURE THIS MAPPING USES THE DYNAMIC COMPONENT
  'brain-sparks-station': BrainSparksStation,
  'village-builders-covenant': VillageBuildersCovenant,
  'musical-dna': MusicalDNADemo,
  'personal-language-key': EnhancedPLKSystemExhibit,
  'billys-room': BillysRoom,
  'alzheimers-legacy': AlzheimersLegacyExhibit,
  'addiction-recovery': AddictionRecoveryExhibit,
  'adhd-power-up-station': ADHDPowerUpStation,
};

export default function ExhibitPage() {
  const params = useParams();
  const slug = params.slug as string;

  if (!slug) {
    return <LoadingSpinner />;
  }
  
  const exhibitData = MUSEUM_EXHIBITS.find(ex => ex.slug === slug);
  const ExhibitComponent = exhibitComponentMap[slug];

  if (!exhibitData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col">
        <h1 className="text-2xl font-bold">Exhibit Not Found</h1>
        <p className="text-slate-400 mt-2">The slug &apos;{slug}&apos; could not be found.</p>
      </div>
    );
  }

  if (ExhibitComponent) {
    return (
      <div className="bg-slate-900">
        <ExhibitComponent />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{exhibitData.title}</h1>
      <p>Details for this exhibit are being woven into the tapestry.</p>
      <p>(This page is a placeholder for exhibits that do not have a full component yet).</p>
    </div>
  );
}
