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
  ArrowRight,
} from 'lucide-react';

interface CategoryConfig {
  title: VibeCategory;
  displayTitle: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryConfig[] = [
  {
    title: 'Daily Drivers',
    displayTitle: 'Daily Commuters',
    tagline: 'Reliable, turn-key transport',
    icon: Car,
  },
  {
    title: 'Work Truck',
    displayTitle: 'Work & Haul Trucks',
    tagline: 'High torque, bed space, beaters',
    icon: Truck,
  },
  {
    title: 'Van',
    displayTitle: 'Campers & Vans',
    tagline: 'AWD conversions & cargo space',
    icon: Box,
  },
  {
    title: '4x4',
    displayTitle: '4x4 & Adventure',
    tagline: 'High clearance & transfer cases',
    icon: Compass,
  },
  {
    title: 'Cheap & Fun',
    displayTitle: 'Enthusiast & Fun',
    tagline: 'Roadsters, hot hatches, RWD',
    icon: Smile,
  },
  {
    title: 'Project Cars',
    displayTitle: 'Weekend Projects',
    tagline: 'Enthusiast garage builds',
    icon: Wrench,
  },
  {
    title: 'Manual',
    displayTitle: 'Manual Gearbox',
    tagline: 'Three pedals and a stick shift',
    icon: Gauge,
  },
  {
    title: 'Mechanic Special',
    displayTitle: 'Mechanic Specials',
    tagline: 'Needs wrenching, deep value',
    icon: AlertTriangle,
  },
  {
    title: 'Under $5K',
    displayTitle: 'Budget Under $5,000',
    tagline: 'Maximum affordable transport',
    icon: DollarSign,
  },
  {
    title: 'Under $10K',
    displayTitle: 'Sweet Spot $5K - $10K',
    tagline: 'Solid daily runners with life left',
    icon: Flame,
  },
];

export const VibeGrid: React.FC = () => {
  const { navigateTo, setSearchFilters, allListings } = useApp();

  const handleCategoryClick = (category: VibeCategory) => {
    if (category === 'Under $5K') {
      setSearchFilters({ category: '', maxPrice: 5000 });
    } else if (category === 'Under $10K') {
      setSearchFilters({ category: '', maxPrice: 10000 });
    } else if (category === 'Manual') {
      setSearchFilters({ category: '', transmission: 'Manual' });
    } else if (category === '4x4') {
      setSearchFilters({ category: '4x4' });
    } else {
      setSearchFilters({ category });
    }
    navigateTo('browse');
  };

  const getCountForCategory = (category: VibeCategory) => {
    return allListings.filter((l) => {
      if (l.status !== 'ACTIVE') return false;
      if (category === 'Under $5K') return l.askingPrice <= 5000;
      if (category === 'Under $10K') return l.askingPrice <= 10000;
      if (category === 'Manual') return l.vehicle.transmission === 'Manual';
      if (category === '4x4') return ['4WD', 'AWD'].includes(l.vehicle.drivetrain);
      return l.category === category;
    }).length;
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C2410C] mb-1">
              Curated Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Explore by vehicle type.
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              From dependable workhorses to mountain rigs and project cars ready for a wrench.
            </p>
          </div>

          <button
            onClick={() => {
              setSearchFilters({});
              navigateTo('browse');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-[#C2410C] transition cursor-pointer"
          >
            <span>View all inventory ({allListings.filter((l) => l.status === 'ACTIVE').length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid of Curated Collections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const count = getCountForCategory(cat.title);
            const Icon = cat.icon;

            return (
              <button
                key={cat.title}
                onClick={() => handleCategoryClick(cat.title)}
                className="group text-left p-4 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-slate-900 border border-slate-200 group-hover:border-slate-900 flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                      {count} {count === 1 ? 'whip' : 'whips'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-[#C2410C] transition-colors leading-snug">
                    {cat.displayTitle}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1 mt-2">
                  {cat.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
