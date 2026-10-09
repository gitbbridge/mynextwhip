import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceStorage } from '../../services/storageService';
import {
  BodyStyle,
  DisclosedIssue,
  DrivetrainType,
  Listing,
  MediaItem,
  ServiceRecord,
  TitleStatus,
  TransmissionType,
  Vehicle,
  VibeCategory,
} from '../../types';
import { decodeVin, SAMPLE_TEST_VINS, validateVinFormat } from '../../services/vinService';
import { ISSUE_PRESETS } from '../../services/whipReportService';
import { resolveLocationFromZip } from '../../services/geoService';
import {
  Car,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Video,
  Flame,
  FileText,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Play,
  ShieldCheck,
  CreditCard,
  Lock,
  Plus,
  Trash2,
  Gavel,
  Clock,
} from 'lucide-react';

const STEPS = [
  'VIN Identification',
  'Basic Specs & Price',
  'Disclose Issues',
  'Vehicle Photos',
  'Cold Start Video',
  'Walkaround Video',
  'Service Records',
  'Review & Confirm',
  'Listing Fee ($19)',
];

export const SellWizard: React.FC = () => {
  const { currentUser, navigateTo, platformConfig, updateListingStatus, showNotification, refreshAll } = useApp();

  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [vinInput, setVinInput] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<Partial<Vehicle> | null>(null);

  // Step 2
  const [askingPrice, setAskingPrice] = useState<string>('4500');
  const [mileage, setMileage] = useState<string>('168000');
  const [zip, setZip] = useState<string>(currentUser.city === 'Colorado Springs' ? '80903' : '80202');
  const [titleStatus, setTitleStatus] = useState<TitleStatus>('Clean');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [drivetrain, setDrivetrain] = useState<DrivetrainType>('FWD');
  const [bodyStyle, setBodyStyle] = useState<BodyStyle>('Sedan');
  const [category, setCategory] = useState<VibeCategory>('Daily Driver');
  const [modifications, setModifications] = useState('');

  // Listing Format: Fixed Price vs Live Auction
  const [listingFormat, setListingFormat] = useState<'FIXED_PRICE' | 'AUCTION'>('FIXED_PRICE');
  const [startingBid, setStartingBid] = useState<string>('1000');
  const [isNoReserve, setIsNoReserve] = useState(true);
  const [reservePrice, setReservePrice] = useState<string>('3000');
  const [auctionDurationDays, setAuctionDurationDays] = useState<number>(7);

  // Step 3: Issues
  const [selectedIssues, setSelectedIssues] = useState<DisclosedIssue[]>([]);
  const [sellerDescription, setSellerDescription] = useState(
    'Runs and drives well for its age. Regularly serviced and reliable. Ready for the next owner.'
  );

  // Step 4: Photos
  const [photos, setPhotos] = useState<MediaItem[]>([
    {
      id: 'p_1',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      label: 'Front Exterior',
      type: 'photo',
    },
    {
      id: 'p_2',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      label: 'Side Profile',
      type: 'photo',
    },
    {
      id: 'p_3',
      url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      label: 'Dashboard & Interior',
      type: 'photo',
    },
  ]);

  // Step 5 & 6: Videos
  const [coldStartVideo, setColdStartVideo] = useState<MediaItem | undefined>({
    id: 'v_cold',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    label: 'Cold Start Audio & Crank Video',
    type: 'video_cold_start',
    durationSeconds: 28,
  });

  const [walkaroundVideo, setWalkaroundVideo] = useState<MediaItem | undefined>(undefined);

  // Step 7: Service Records
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: 'sr_1',
      date: '2026-05-10',
      mileage: 165000,
      workPerformed: 'Synthetic oil service, tire rotation, new spark plugs',
      cost: 185,
      shopOrDiy: 'DIY in garage',
    },
  ]);

  // Step 8: Confirmation
  const [isTruthConfirmed, setIsTruthConfirmed] = useState(false);

  // Step 9: Payment
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // VIN handler
  const handleDecodeVin = async (vinToDecode: string) => {
    setIsDecoding(true);
    setVinError(null);
    try {
      const res = await decodeVin(vinToDecode);
      if (res.valid && res.data) {
        setDecodedData(res.data);
        if (res.data.mileage) setMileage(res.data.mileage.toString());
        if (res.data.titleStatus) setTitleStatus(res.data.titleStatus);
        if (res.data.transmission) setTransmission(res.data.transmission);
        if (res.data.drivetrain) setDrivetrain(res.data.drivetrain);
        if (res.data.bodyStyle) setBodyStyle(res.data.bodyStyle);
      } else {
        setVinError(res.error || 'Could not decode VIN. Please verify and retry.');
      }
    } catch (err: any) {
      setVinError(err.message || 'Error communicating with NHTSA database.');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleToggleIssue = (preset: typeof ISSUE_PRESETS[0]) => {
    const existingIndex = selectedIssues.findIndex((i) => i.category === preset.category);
    if (existingIndex >= 0) {
      setSelectedIssues(selectedIssues.filter((_, idx) => idx !== existingIndex));
    } else {
      setSelectedIssues([
        ...selectedIssues,
        {
          id: `iss_${Date.now()}_${preset.category}`,
          category: preset.category,
          title: preset.title,
          severity: preset.defaultSeverity,
          description: preset.descriptionPlaceholder,
          affectsDrivability: preset.defaultSeverity === 'critical',
        },
      ]);
    }
  };

  const handleUpdateIssueNote = (id: string, note: string) => {
    setSelectedIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, description: note } : iss))
    );
  };

  const handleAddServiceRecord = () => {
    setServiceRecords([
      ...serviceRecords,
      {
        id: `sr_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mileage: Number(mileage) || 150000,
        workPerformed: 'Recent service or parts replaced',
        cost: 100,
        shopOrDiy: 'Mechanic / DIY',
      },
    ]);
  };

  const handleRemoveServiceRecord = (id: string) => {
    setServiceRecords(serviceRecords.filter((r) => r.id !== id));
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);

      // Create new Listing in storage
      const loc = resolveLocationFromZip(zip);
      const vehicleYear = decodedData?.year || 2006;
      const vehicleMake = decodedData?.make || 'Toyota';
      const vehicleModel = decodedData?.model || 'Vehicle';
      const slug = `${vehicleYear}-${vehicleMake.toLowerCase()}-${vehicleModel.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;

      const newListing: Listing = {
        id: `whip_${Date.now()}`,
        slug,
        vehicle: {
          vin: vinInput.toUpperCase() || '5TFRX44N88Z482910',
          year: vehicleYear,
          make: vehicleMake,
          model: vehicleModel,
          trim: decodedData?.trim || '',
          mileage: Number(mileage) || 150000,
          engine: decodedData?.engine || '4-Cylinder Gas',
          transmission,
          drivetrain,
          bodyStyle,
          fuelType: decodedData?.fuelType || 'Gasoline',
          exteriorColor: decodedData?.exteriorColor || 'Silver',
          interiorColor: decodedData?.interiorColor || 'Grey',
          titleStatus,
          modifications: modifications.trim() || undefined,
        },
        sellerId: currentUser.id,
        seller: currentUser,
        askingPrice: listingFormat === 'AUCTION' ? (Number(startingBid) || 1000) : (Number(askingPrice) || 4500),
        listingFormat,
        auction: listingFormat === 'AUCTION' ? {
          startingBid: Number(startingBid) || 1000,
          reservePrice: isNoReserve ? undefined : (Number(reservePrice) || undefined),
          isNoReserve,
          currentBid: Number(startingBid) || 1000,
          bidsCount: 0,
          endsAt: new Date(Date.now() + auctionDurationDays * 24 * 3600 * 1000).toISOString(),
          durationDays: auctionDurationDays,
          bids: [],
        } : undefined,
        status: 'PENDING_REVIEW', // Enters moderation state machine!
        category,
        location: loc,
        sellerDescription: sellerDescription.trim(),
        issues: selectedIssues,
        serviceRecords,
        photos,
        coldStartVideo,
        walkaroundVideo,
        verifications: {
          vinDecoded: true,
          titleReviewed: false,
          coldStartProvided: !!coldStartVideo,
          walkaroundProvided: !!walkaroundVideo,
          serviceRecordsProvided: serviceRecords.length > 0,
          sellerVerified: currentUser.verifiedSeller,
        },
        stats: { views: 1, saves: 0, offersCount: 0 },
        listingFeePaid: true,
        listingFeeAmount: platformConfig.standardListingFee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save via AppContext/Storage
      MarketplaceStorage.saveListing(newListing);
      refreshAll();

      setIsSubmittedSuccess(true);
    }, 1800);
  };

  // Success Confirmation Screen
  if (isSubmittedSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-zinc-200 p-8 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Confirmed (${platformConfig.standardListingFee})
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading">
            YOUR WHIP HAS BEEN SUBMITTED!
          </h1>

          <p className="text-sm text-zinc-600 leading-relaxed">
            Your listing is currently in our <span className="font-bold text-zinc-900">Moderation Queue (PENDING_REVIEW)</span>. Platform moderators will review VIN documents and photo evidence before making it live to buyers.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-700 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Vehicle:</span>
              <span className="font-bold font-heading">{decodedData?.year} {decodedData?.make} {decodedData?.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Format & Price:</span>
              <span className="font-mono font-bold text-zinc-900">
                {listingFormat === 'AUCTION'
                  ? `Live Auction ($${Number(startingBid).toLocaleString()} Start${isNoReserve ? ' · No Reserve' : ''})`
                  : `$${Number(askingPrice).toLocaleString()} Fixed`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Known Issues Disclosed:</span>
              <span className="font-bold text-amber-700">{selectedIssues.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Cold-Start Video:</span>
              <span className="font-bold text-emerald-700">Attached</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('admin')}
              className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Open Admin Moderation
            </button>
            <button
              onClick={() => navigateTo('browse')}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Browse Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-24">
      {/* Top Header & Step Progress Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C2410C]">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                {STEPS[currentStep]}
              </h1>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          {/* STEP 1: VIN Identification */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
                  Step 1: Vehicle Identification
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
                  Identify your vehicle.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your 17-character VIN. We automatically decode Year, Make, Model, Trim, and Engine via the NHTSA database.
                </p>
              </div>

              {/* VIN Input & Decode Button */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  17-Character VIN
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={17}
                    placeholder="e.g. 5TFRX44N88Z482910"
                    value={vinInput}
                    onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                    className="flex-1 py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-semibold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
                  />
                  <button
                    type="button"
                    disabled={isDecoding || vinInput.length !== 17}
                    onClick={() => handleDecodeVin(vinInput)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    {isDecoding ? 'Decoding...' : 'Decode VIN'}
                  </button>
                </div>

                {vinError && (
                  <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{vinError}</span>
                  </p>
                )}
              </div>

              {/* Sample Enthusiast Test VIN Presets */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Quick-Fill Test VINs (Click to load):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_TEST_VINS.slice(0, 4).map((sample) => (
                    <button
                      key={sample.vin}
                      type="button"
                      onClick={() => {
                        setVinInput(sample.vin);
                        handleDecodeVin(sample.vin);
                      }}
                      className="text-left p-2.5 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-xs transition cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 truncate">{sample.label}</div>
                      <div className="text-[11px] font-mono text-slate-400">{sample.vin}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Decoded Result Preview */}
              {decodedData && (
                <div className="p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>NHTSA Database Match Confirmed</span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 font-heading">
                    {decodedData.year} {decodedData.make} {decodedData.model} {decodedData.trim}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-700">
                    <div>
                      <span className="text-zinc-400">Body:</span>{' '}
                      <span className="font-semibold">{decodedData.bodyStyle}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Engine:</span>{' '}
                      <span className="font-semibold">{decodedData.engine}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Drivetrain:</span>{' '}
                      <span className="font-semibold">{decodedData.drivetrain}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Basic Details & Price */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 2: Basic Details & Format
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Choose format, price & location.
                </h2>
              </div>

              {/* Format Selector: Fixed Price vs Live Auction */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Selling Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setListingFormat('FIXED_PRICE')}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      listingFormat === 'FIXED_PRICE'
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm font-heading">Fixed Asking Price</span>
                      {listingFormat === 'FIXED_PRICE' && (
                        <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-snug ${listingFormat === 'FIXED_PRICE' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      Traditional classified listing. Set a firm price, review buyer offers, and coordinate meetups.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setListingFormat('AUCTION')}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      listingFormat === 'AUCTION'
                        ? 'bg-orange-950/90 text-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Gavel className={`w-4 h-4 ${listingFormat === 'AUCTION' ? 'text-[#EA580C]' : 'text-zinc-500'}`} />
                        <span className="font-extrabold text-sm font-heading">Live Auction</span>
                      </div>
                      {listingFormat === 'AUCTION' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
                      ) : (
                        <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.2 rounded uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-snug ${listingFormat === 'AUCTION' ? 'text-orange-200' : 'text-zinc-500'}`}>
                      Competitive live bidding with countdown clock, anti-sniping protection, and reserve options.
                    </p>
                  </button>
                </div>
              </div>

              {/* Auction Configuration Box (when AUCTION selected) */}
              {listingFormat === 'AUCTION' && (
                <div className="p-5 bg-orange-50/80 border border-orange-200 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-[#EA580C]" />
                    <h3 className="font-bold text-sm text-zinc-900 font-heading">
                      Auction Parameters
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Starting Bid ($ USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="number"
                          step={50}
                          value={startingBid}
                          onChange={(e) => setStartingBid(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl font-mono text-sm font-bold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <span className="text-[11px] text-zinc-500 mt-1 block">
                        Low starting bids ($100–$1,000) attract the most early watchers.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Auction Duration
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[3, 5, 7].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setAuctionDurationDays(days)}
                            className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              auctionDurationDays === days
                                ? 'bg-zinc-900 text-white border-zinc-900'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            {days} Days
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reserve Options */}
                  <div className="pt-2 border-t border-orange-200/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      Reserve Price
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                        <input
                          type="radio"
                          name="reserveChoice"
                          checked={isNoReserve}
                          onChange={() => setIsNoReserve(true)}
                          className="w-4 h-4 text-[#EA580C]"
                        />
                        <span>No Reserve (Vehicle sells to highest bidder, highest engagement)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                        <input
                          type="radio"
                          name="reserveChoice"
                          checked={!isNoReserve}
                          onChange={() => setIsNoReserve(false)}
                          className="w-4 h-4 text-[#EA580C]"
                        />
                        <span>Set Hidden Reserve Price</span>
                      </label>
                    </div>

                    {!isNoReserve && (
                      <div className="mt-3 max-w-xs">
                        <div className="relative">
                          <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="number"
                            step={100}
                            placeholder="e.g. 4000"
                            value={reservePrice}
                            onChange={(e) => setReservePrice(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-sm font-bold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                          />
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-1 block">
                          Hidden from buyers. If bids do not reach this price, you are not obligated to sell.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listingFormat === 'FIXED_PRICE' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Asking Price ($ USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        step={50}
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-mono text-base font-bold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Current Odometer (Miles)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl font-mono text-base font-bold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl font-mono text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Title Status
                  </label>
                  <select
                    value={titleStatus}
                    onChange={(e) => setTitleStatus(e.target.value as TitleStatus)}
                    className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="Clean">Clean Title</option>
                    <option value="Rebuilt">Rebuilt / Prior Salvage</option>
                    <option value="Salvage">Salvage (Needs inspection)</option>
                    <option value="Missing">Bill of Sale Only (No Title)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Transmission
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Automatic', 'Manual'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTransmission(t as TransmissionType)}
                        className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          transmission === t
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Drivetrain
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['FWD', 'RWD', 'AWD', '4WD'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDrivetrain(d as DrivetrainType)}
                        className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          drivetrain === d
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Aftermarket Modifications (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2-inch leveling kit, bluetooth radio, aftermarket exhaust..."
                  value={modifications}
                  onChange={(e) => setModifications(e.target.value)}
                  className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Tell Us What's Wrong (Principle 1: Honest over pretty) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 3: Honest Disclosures
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Be real. What's going on with it?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  On MyNextWhip, disclosing problems builds instant buyer trust. Check any that apply:
                </p>
              </div>

              {/* Grid of selectable issues */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                {ISSUE_PRESETS.map((preset) => {
                  const isSelected = selectedIssues.some((i) => i.category === preset.category);
                  return (
                    <button
                      key={preset.category}
                      type="button"
                      onClick={() => handleToggleIssue(preset)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <span className="truncate">{preset.title}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-zinc-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Issue Detail Note Boxes */}
              {selectedIssues.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Add Details for Disclosed Items ({selectedIssues.length})
                  </span>
                  {selectedIssues.map((iss) => (
                    <div key={iss.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                        <span>{iss.title}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedIssues(selectedIssues.filter((i) => i.id !== iss.id))}
                          className="text-red-500 hover:text-red-700 text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={iss.description}
                        onChange={(e) => handleUpdateIssueNote(iss.id, e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800 focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Full seller description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Tell buyers anything else they should know (Full Story)
                </label>
                <textarea
                  rows={4}
                  value={sellerDescription}
                  onChange={(e) => setSellerDescription(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Photos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 4: Photography
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Upload Vehicle Photos
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  Include front, rear, driver side, interior, dashboard cluster, and photos of known damage.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((ph, idx) => (
                  <div key={ph.id || idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-zinc-300 group">
                    <img src={ph.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                      {ph.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Upload Slot */}
                <button
                  type="button"
                  onClick={() => {
                    const samplePics = [
                      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
                    ];
                    const nextPic = samplePics[photos.length % samplePics.length];
                    setPhotos([
                      ...photos,
                      {
                        id: `ph_${Date.now()}`,
                        url: nextPic,
                        label: `Photo ${photos.length + 1}`,
                        type: 'photo',
                      },
                    ]);
                  }}
                  className="aspect-4/3 rounded-xl border-2 border-dashed border-zinc-300 hover:border-[#EA580C] bg-zinc-50 flex flex-col items-center justify-center text-zinc-500 hover:text-[#EA580C] transition cursor-pointer p-4"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">+ Add Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Cold Start Video */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 5: Cold Start Video
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Let them hear it start.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                  Record the vehicle starting cold after sitting overnight. Let buyers hear the crank, listen for exhaust ticks, and see the idle stabilize.
                </p>
              </div>

              {coldStartVideo ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900">Cold-Start Video Attached</div>
                      <div className="text-xs text-zinc-500">Duration: 28 seconds · Audio verified</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setColdStartVideo(undefined)}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-orange-300 rounded-2xl bg-orange-50/50 text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 text-[#EA580C] rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900">Record or Upload Cold Start</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Show cluster lights turn on, starter crank, and exhaust pipe.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setColdStartVideo({
                        id: 'v_cold',
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        label: 'Cold Start Audio & Crank Video',
                        type: 'video_cold_start',
                        durationSeconds: 28,
                      })
                    }
                    className="px-4 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Upload Video / Use Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Walkaround Video */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 6: Walkaround Video
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Show what they're really getting.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                  Optional but strongly recommended. Walk around the exterior, show tire tread, undercarriage frame rails, and interior.
                </p>
              </div>

              {walkaroundVideo ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900">Walkaround Video Attached</div>
                      <div className="text-xs text-zinc-500">Duration: 45 seconds</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWalkaroundVideo(undefined)}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-zinc-300 rounded-2xl bg-zinc-50 text-center space-y-3">
                  <Video className="w-8 h-8 text-zinc-400 mx-auto" />
                  <h4 className="font-bold text-sm text-zinc-900">Upload 360° Walkaround Video</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Show paint condition, rust spots, panel gaps, and engine bay running.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setWalkaroundVideo({
                        id: 'v_walk',
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                        label: 'Walkaround & Undercarriage Inspection',
                        type: 'video_walkaround',
                        durationSeconds: 45,
                      })
                    }
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Attach Walkaround Video
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Service Records */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Step 7: Maintenance Records
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                    Service Records & Receipts
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddServiceRecord}
                  className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Record
                </button>
              </div>

              {serviceRecords.length > 0 ? (
                <div className="space-y-3">
                  {serviceRecords.map((r) => (
                    <div key={r.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <input
                          type="date"
                          value={r.date}
                          onChange={(e) =>
                            setServiceRecords(
                              serviceRecords.map((sr) => (sr.id === r.id ? { ...sr, date: e.target.value } : sr))
                            )
                          }
                          className="bg-white border border-zinc-300 rounded px-2 py-1"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-mono">$</span>
                          <input
                            type="number"
                            value={r.cost}
                            onChange={(e) =>
                              setServiceRecords(
                                serviceRecords.map((sr) =>
                                  sr.id === r.id ? { ...sr, cost: Number(e.target.value) } : sr
                                )
                              )
                            }
                            className="w-20 bg-white border border-zinc-300 rounded px-2 py-1 font-mono font-bold text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceRecord(r.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Work performed..."
                        value={r.workPerformed}
                        onChange={(e) =>
                          setServiceRecords(
                            serviceRecords.map((sr) =>
                              sr.id === r.id ? { ...sr, workPerformed: e.target.value } : sr
                            )
                          )
                        }
                          className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900"
                        />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No service records added yet. Click "+ Add Record".</p>
              )}
            </div>
          )}

          {/* STEP 8: Review & Seller Confirmation */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 8: Review Listing
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  Confirm your disclosures.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  This is exactly what buyers will see in your public Whip Report.
                </p>
              </div>

              {/* Review card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex justify-between items-baseline border-b border-zinc-200 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        listingFormat === 'AUCTION'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}>
                        {listingFormat === 'AUCTION' ? `Live Auction (${auctionDurationDays} Days)` : 'Fixed Asking Price'}
                      </span>
                      {listingFormat === 'AUCTION' && isNoReserve && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                          No Reserve
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 font-heading">
                      {decodedData?.year} {decodedData?.make} {decodedData?.model}
                    </h3>
                    <p className="text-zinc-500">{Number(mileage).toLocaleString()} miles · {titleStatus} Title</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      {listingFormat === 'AUCTION' ? 'Starting Bid' : 'Asking Price'}
                    </span>
                    <div className="text-2xl font-black text-zinc-900 font-mono-numbers">
                      ${(listingFormat === 'AUCTION' ? Number(startingBid) : Number(askingPrice)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-zinc-700 block mb-1">Disclosed Issues ({selectedIssues.length}):</span>
                  {selectedIssues.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                      {selectedIssues.map((i) => (
                        <li key={i.id}>
                          <span className="font-bold text-zinc-900">{i.title}:</span> {i.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-zinc-500">None disclosed.</span>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-200 flex items-center gap-4 text-zinc-500">
                  <span>📸 {photos.length} Photos</span>
                  <span>🔥 Cold Start Video: {coldStartVideo ? 'Yes' : 'No'}</span>
                  <span>📄 {serviceRecords.length} Service Records</span>
                </div>
              </div>

              {/* Mandatory Seller Confirmation Declaration (Section 29) */}
              <div className="p-4 bg-orange-50/80 border border-orange-300 rounded-2xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTruthConfirmed}
                    onChange={(e) => setIsTruthConfirmed(e.target.checked)}
                    className="w-5 h-5 text-[#EA580C] rounded focus:ring-orange-500 mt-0.5"
                  />
                  <span className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                    I confirm that the information provided is accurate to the best of my knowledge, and I have not hidden known major safety or mechanical defects.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 9: Payment & Submit to Moderation */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Step 9: Listing Fee
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading mt-1">
                  LIST YOUR WHIP
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  Transparent, flat listing fee. No hidden final value cuts.
                </p>
              </div>

              {/* Pricing breakdown (Configurable from platformConfig) */}
              <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black font-heading">STANDARD LISTING</h3>
                    <p className="text-xs text-zinc-400">Photos, Cold-Start Video, Messaging, Offers</p>
                  </div>
                  <div className="text-3xl font-black font-mono-numbers text-[#EA580C]">
                    ${platformConfig.standardListingFee}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NHTSA VIN Equipment Verification included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Video streaming & mobile compression included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In-app messaging & offer management</span>
                  </div>
                </div>
              </div>

              {/* Stripe checkout simulation */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between text-zinc-700 font-bold uppercase text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-zinc-500" />
                    <span>Stripe Card Payment</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 text-[10px]">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit Encrypted</span>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-zinc-300 rounded-xl font-mono text-xs text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY (08/28)"
                    defaultValue="08/28"
                    className="w-full py-2 px-3 bg-white border border-zinc-300 rounded-xl font-mono text-xs text-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder="CVC (123)"
                    defaultValue="123"
                    className="w-full py-2 px-3 bg-white border border-zinc-300 rounded-xl font-mono text-xs text-zinc-900"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleSimulatePayment}
                className="w-full py-4 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-950/40 transition cursor-pointer flex items-center justify-center gap-2 font-heading"
              >
                {isProcessingPayment ? (
                  <span>Processing Payment & Moderation...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PAY ${platformConfig.standardListingFee} & SUBMIT LISTING</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-zinc-200 flex items-center justify-between">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                disabled={
                  (currentStep === 0 && (!decodedData || vinInput.length !== 17)) ||
                  (currentStep === 7 && !isTruthConfirmed)
                }
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
