import React from 'react';
import { useApp } from '../../context/AppContext';
import { VibeCategory } from '../../types';
import {
  Car,
  Wrench,
  Truck,
  Box,
  Smile,
  AlertTriangle,
  Compass,
  Gauge,
  DollarSign,
  Flame,
} from 'lucide-react';

interface VibeCardConfig {
  title: VibeCategory;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgColor: string;
}

const VIBES: VibeCardConfig[] = [
  {
    title: 'Daily Drivers',
    tagline: 'Get to work every day reliably',
    icon: Car,
    accentColor: 'text-blue-400',
    bgColor: 'group-hover:border-blue-500/50',
  },
  {
    title: 'Project Cars',
    tagline: 'Wrenches, garage weekends & fun',
    icon: Wrench,
    accentColor: 'text-amber-400',
    bgColor: 'group-hover:border-amber-500/50',
  },
  {
    title: 'Work Truck',
    tagline: 'Bed space, torque, hauler beaters',
    icon: Truck,
    accentColor: 'text-orange-400',
    bgColor: 'group-hover:border-orange-500/50',
  },
  {
    title: 'Van',
    tagline: 'Camper conversions & cargo work',
    icon: Box,
    accentColor: 'text-emerald-400',
    bgColor: 'group-hover:border-emerald-500/50',
  },
  {
    title: 'Cheap & Fun',
    tagline: 'Miatas, hot hatches, rear-wheel drive',
    icon: Smile,
    accentColor: 'text-pink-400',
    bgColor: 'group-hover:border-pink-500/50',
  },
  {
    title: 'Mechanic Special',
    tagline: 'Needs mechanical love, deep discount',
    icon: AlertTriangle,
    accentColor: 'text-red-400',
    bgColor: 'group-hover:border-red-500/50',
  },
  {
    title: '4x4',
    tagline: 'High clearance, transfer case, snow ready',
    icon: Compass,
    accentColor: 'text-teal-400',
    bgColor: 'group-hover:border-teal-500/50',
  },
  {
    title: 'Manual',
    tagline: 'Three pedals & stick shift only',
    icon: Gauge,
    accentColor: 'text-purple-400',
    bgColor: 'group-hover:border-purple-500/50',
  },
  {
    title: 'Under $5K',
    tagline: 'Maximum budget car bargains',
    icon: DollarSign,
    accentColor: 'text-emerald-400',
    bgColor: 'group-hover:border-emerald-500/50',
  },
  {
    title: 'Under $10K',
    tagline: 'The sweet spot for budget whips',
    icon: Flame,
    accentColor: 'text-orange-500',
    bgColor: 'group-hover:border-orange-500/50',
  },
];

export const VibeGrid: React.FC = () => {
  const { navigateTo, setSearchFilters, allListings } = useApp();

  const handleVibeClick = (vibe: VibeCategory) => {
    if (vibe === 'Under $5K') {
      setSearchFilters({ category: '', maxPrice: 5000 });
    } else if (vibe === 'Under $10K') {
      setSearchFilters({ category: '', maxPrice: 10000 });
    } else if (vibe === 'Manual') {
      setSearchFilters({ category: '', transmission: 'Manual' });
    } else if (vibe === '4x4') {
      setSearchFilters({ category: '4x4' });
    } else {
      setSearchFilters({ category: vibe });
    }
    navigateTo('browse');
  };

  const getCountForVibe = (vibe: VibeCategory) => {
    return allListings.filter((l) => {
      if (l.status !== 'ACTIVE') return false;
      if (vibe === 'Under $5K') return l.askingPrice <= 5000;
      if (vibe === 'Under $10K') return l.askingPrice <= 10000;
      if (vibe === 'Manual') return l.vehicle.transmission === 'Manual';
      if (vibe === '4x4') return ['4WD', 'AWD'].includes(l.vehicle.drivetrain);
      return l.category === vibe;
    }).length;
  };

  return (
    <section className="py-12 bg-[#F8F9FA] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Inventory Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-heading mt-1">
              SHOP BY VIBE
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              From beater daily drivers to trail-ready projects and high-mileage workhorses.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchFilters({});
              navigateTo('browse');
            }}
            className="hidden sm:inline-flex items-center text-xs font-bold text-[#EA580C] hover:text-[#C2410C] transition cursor-pointer"
          >
            <span>View All Whips ({allListings.filter((l) => l.status === 'ACTIVE').length})</span>
            <span className="ml-1">→</span>
          </button>
        </div>

        {/* Grid of 10 vibes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {VIBES.map((v) => {
            const count = getCountForVibe(v.title);
            const Icon = v.icon;

            return (
              <button
                key={v.title}
                onClick={() => handleVibeClick(v.title)}
                className={`group text-left p-3.5 sm:p-4 rounded-xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer ${v.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 transition-colors ${v.accentColor}`}>
                    <Icon className="w-5 h-5 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-zinc-400 group-hover:text-zinc-700">
                    {count} {count === 1 ? 'whip' : 'whips'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#EA580C] transition-colors leading-tight">
                  {v.title}
                </h3>
                <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  {v.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
