import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BodyStyle, DrivetrainType, TitleStatus, TransmissionType, VibeCategory } from '../../types';
import { RADIUS_OPTIONS } from '../../services/geoService';
import { X, RotateCcw, Bookmark, Check, SlidersHorizontal, MapPin } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BODY_STYLES: BodyStyle[] = [
  'Sedan',
  'Coupe',
  'Hatchback',
  'Wagon',
  'SUV',
  'Truck',
  'Van',
  'Convertible',
];

const CATEGORIES: VibeCategory[] = [
  'Daily Driver',
  'Project',
  'Mechanic Special',
  'Work Truck',
  'Van',
  'Cheap & Fun',
  '4x4',
  'Manual',
  'Under $5K',
  'Under $10K',
];

const TITLE_STATUSES: TitleStatus[] = ['Clean', 'Rebuilt', 'Salvage'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  const { searchFilters, setSearchFilters, resetFilters, saveCurrentSearch } = useApp();

  const [localMaxPrice, setLocalMaxPrice] = useState(searchFilters.maxPrice || '');
  const [localMaxMileage, setLocalMaxMileage] = useState(searchFilters.maxMileage || '');
  const [localMake, setLocalMake] = useState(searchFilters.make || '');
  const [localModel, setLocalModel] = useState(searchFilters.model || '');
  const [localZip, setLocalZip] = useState(searchFilters.zip || '80202');
  const [localRadius, setLocalRadius] = useState(searchFilters.radiusMiles || 50);

  if (!isOpen) return null;

  const handleApply = () => {
    setSearchFilters({
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
      maxMileage: localMaxMileage ? Number(localMaxMileage) : undefined,
      make: localMake.trim(),
      model: localModel.trim(),
      zip: localZip.trim(),
      radiusMiles: localRadius,
    });
    onClose();
  };

  const handleReset = () => {
    resetFilters();
    setLocalMaxPrice('');
    setLocalMaxMileage('');
    setLocalMake('');
    setLocalModel('');
    setLocalRadius(50);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-lg font-black text-zinc-900 font-heading tracking-tight">
              Filters & Radius
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* Location & Radius */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Location & Search Distance
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  maxLength={5}
                  value={localZip}
                  onChange={(e) => setLocalZip(e.target.value)}
                  placeholder="ZIP (e.g. 80202)"
                  className="w-full pl-8 pr-2 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
              <select
                value={localRadius}
                onChange={(e) => setLocalRadius(Number(e.target.value))}
                className="w-full py-2 px-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Maximum Asking Price
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={500}
                placeholder="e.g. 8000"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full py-2 px-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              />
              <span className="text-zinc-500 font-mono text-xs">USD</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[3000, 5000, 8000, 10000].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setLocalMaxPrice(p.toString())}
                  className={`text-[11px] px-2 py-1 rounded-md border cursor-pointer ${
                    localMaxPrice === p.toString()
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  ${(p / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Max Mileage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Maximum Mileage
            </label>
            <input
              type="number"
              step={10000}
              placeholder="e.g. 200000"
              value={localMaxMileage}
              onChange={(e) => setLocalMaxMileage(e.target.value)}
              className="w-full py-2 px-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Make & Model */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Make
              </label>
              <input
                type="text"
                placeholder="Toyota, Ford..."
                value={localMake}
                onChange={(e) => setLocalMake(e.target.value)}
                className="w-full py-2 px-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Model
              </label>
              <input
                type="text"
                placeholder="Tacoma, Civic..."
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="w-full py-2 px-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Auction & Format Filter */}
          <div className="p-3.5 bg-zinc-900 text-white rounded-xl space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-orange-400">
              Listing Format & Auctions
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'All', value: 'ALL' },
                { label: 'Auctions', value: 'AUCTION' },
                { label: 'Fixed Price', value: 'FIXED_PRICE' },
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => setSearchFilters({ listingFormat: fmt.value as any })}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    (searchFilters.listingFormat || 'ALL') === fmt.value
                      ? 'bg-[#EA580C] text-white border-orange-500'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer pt-1 border-t border-zinc-800">
              <input
                type="checkbox"
                checked={searchFilters.noReserveOnly || false}
                onChange={(e) => setSearchFilters({ noReserveOnly: e.target.checked })}
                className="w-4 h-4 text-[#EA580C] rounded focus:ring-orange-500"
              />
              <span>No Reserve Auctions Only</span>
            </label>
          </div>

          {/* Evidence Checkboxes - Principle 2 */}
          <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-2.5">
            <span className="block text-xs font-bold uppercase tracking-wider text-orange-950">
              Evidence & Video Requirements
            </span>
            <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={searchFilters.hasColdStart || false}
                onChange={(e) => setSearchFilters({ hasColdStart: e.target.checked })}
                className="w-4 h-4 text-[#EA580C] rounded focus:ring-orange-500"
              />
              <span>Has Cold-Start Video</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={searchFilters.hasWalkaround || false}
                onChange={(e) => setSearchFilters({ hasWalkaround: e.target.checked })}
                className="w-4 h-4 text-[#EA580C] rounded focus:ring-orange-500"
              />
              <span>Has Walkaround Video</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={searchFilters.hasServiceRecords || false}
                onChange={(e) => setSearchFilters({ hasServiceRecords: e.target.checked })}
                className="w-4 h-4 text-[#EA580C] rounded focus:ring-orange-500"
              />
              <span>Has Service Records Attached</span>
            </label>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Transmission
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['', 'Manual', 'Automatic'] as (TransmissionType | '')[]).map((trans) => (
                <button
                  key={trans || 'all'}
                  type="button"
                  onClick={() => setSearchFilters({ transmission: trans })}
                  className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    (searchFilters.transmission || '') === trans
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {trans ? trans : 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Drivetrain */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Drivetrain
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['', '4WD', 'AWD', 'RWD', 'FWD'] as (DrivetrainType | '')[]).map((drive) => (
                <button
                  key={drive || 'all'}
                  type="button"
                  onClick={() => setSearchFilters({ drivetrain: drive })}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    (searchFilters.drivetrain || '') === drive
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {drive || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Title Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Title Status
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['', ...TITLE_STATUSES] as (TitleStatus | '')[]).map((t) => (
                <button
                  key={t || 'all'}
                  type="button"
                  onClick={() => setSearchFilters({ titleStatus: t })}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    (searchFilters.titleStatus || '') === t
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {t || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Seller Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'All', value: 'ALL' },
                { label: 'Private Party', value: 'PRIVATE' },
                { label: 'Licensed Dealer', value: 'DEALER' },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSearchFilters({ sellerType: s.value as any })}
                  className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    (searchFilters.sellerType || 'ALL') === s.value
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-xl transition cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              handleApply();
              saveCurrentSearch();
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Save this Search"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Search</span>
          </button>

          <button
            onClick={handleApply}
            className="flex-1 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
