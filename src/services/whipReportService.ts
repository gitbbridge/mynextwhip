import { DisclosedIssue, IssueCategory } from '../types';

export interface IssuePreset {
  category: IssueCategory;
  title: string;
  defaultSeverity: 'minor' | 'moderate' | 'major' | 'critical';
  descriptionPlaceholder: string;
  buyerQuestionTip: string;
  buyerChecklistItems: string[];
}

export const ISSUE_PRESETS: IssuePreset[] = [
  {
    category: 'oil_leak',
    title: 'Oil Leak',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Small drip from valve cover gasket after parking. Adds ~1 quart every 2,500 miles.',
    buyerQuestionTip: 'Ask about the rate of loss and if it drips onto hot exhaust manifolds.',
    buyerChecklistItems: [
      'How much oil does it consume or leak between oil changes (quarts per 1,000 miles)?',
      'Does it drip on the ground or smell like burning oil when driving/stopping at red lights?',
      'Has a mechanic identified the source (valve cover, oil pan, or rear main seal)?',
    ],
  },
  {
    category: 'check_engine',
    title: 'Check Engine Light',
    defaultSeverity: 'moderate',
    descriptionPlaceholder: 'e.g. P0420 catalytic converter efficiency code. Light has been on for 6 months.',
    buyerQuestionTip: 'Ask for specific OBD-II diagnostic trouble codes and state emissions readiness.',
    buyerChecklistItems: [
      'What are the exact diagnostic trouble codes (OBD-II scanner read)?',
      'Has it passed your local state emissions inspection recently, or are monitors reset?',
      'Does the vehicle go into limp mode or lose power when the light is illuminated?',
    ],
  },
  {
    category: 'coolant_leak',
    title: 'Coolant Leak / Running Warm',
    defaultSeverity: 'major',
    descriptionPlaceholder: 'e.g. Radiator plastic end tank seeps under pressure. Temp gauge stays steady if topped up.',
    buyerQuestionTip: 'Ask if the engine has ever overheated or been run dry of coolant.',
    buyerChecklistItems: [
      'Has the temperature needle ever reached the red zone / boiling point?',
      'Is there sweet-smelling white exhaust smoke or milky residue under the oil filler cap?',
      'When was the radiator, thermostat, or water pump last replaced?',
    ],
  },
  {
    category: 'rust',
    title: 'Rust / Corrosion',
    defaultSeverity: 'moderate',
    descriptionPlaceholder: 'e.g. Surface rust on rear wheel arches and rocker panels. Frame rails are solid.',
    buyerQuestionTip: 'Confirm whether rust is cosmetic body-panel scale or structural frame rot.',
    buyerChecklistItems: [
      'Is the rust strictly cosmetic on outer panels, or is there frame, subframe, or strut tower corrosion?',
      'Can you poke the frame rails and cab corners with a screwdriver without soft crumbling metal?',
      'Has the vehicle spent winters in the salt belt or near coastal salt air?',
    ],
  },
  {
    category: 'transmission',
    title: 'Transmission / Clutch Issue',
    defaultSeverity: 'major',
    descriptionPlaceholder: 'e.g. 2nd-to-3rd gear shifts hard when cold. Shifts smooth once warmed up.',
    buyerQuestionTip: 'Ask if slipping happens in specific gears and whether reverse works properly.',
    buyerChecklistItems: [
      'Does it slip during acceleration, shift late, or shudder at highway speeds?',
      'Does reverse engage promptly without delayed clunking?',
      'When was transmission fluid or clutch/flywheel last serviced?',
    ],
  },
  {
    category: 'ac_broken',
    title: 'A/C Doesn’t Blow Cold',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Blows room temperature air. Heater and defrost work great.',
    buyerQuestionTip: 'Ask if the A/C compressor clutch actually clicks on and spins.',
    buyerChecklistItems: [
      'Does the compressor clutch visibly engage when turning on maximum A/C?',
      'Has it ever had a refrigerant recharge or UV dye leak test?',
      'Does the blower fan motor work on all speeds (1 through 4)?',
    ],
  },
  {
    category: 'suspension',
    title: 'Suspension / Steering Clunk',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Clunk from front passenger side over sharp bumps. Needs sway bar end links.',
    buyerQuestionTip: 'Ask if there is steering play, death wobble, or uneven tire wear.',
    buyerChecklistItems: [
      'Does the steering wheel pull to one side or vibrate at 60+ mph?',
      'Are tires wearing unevenly on inside or outside tread shoulders?',
      'Have ball joints, tie rod ends, or control arm bushings been inspected recently?',
    ],
  },
  {
    category: 'bad_brakes',
    title: 'Brakes Need Attention',
    defaultSeverity: 'moderate',
    descriptionPlaceholder: 'e.g. Squeals lightly when stopping. Rear pads have ~20% life remaining.',
    buyerQuestionTip: 'Ask if the brake pedal feels spongy or pulsates under hard braking.',
    buyerChecklistItems: [
      'Does the brake pedal feel firm or sink slowly toward the floorboard?',
      'Does the steering wheel shake/pulsate when braking from highway speed (warped rotors)?',
      'Does the parking brake/emergency brake hold the vehicle firmly on an incline?',
    ],
  },
  {
    category: 'bad_tires',
    title: 'Tires Worn / Mismatched',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Front tires have ~4/32” tread, rears are newer. Will need new fronts by winter.',
    buyerQuestionTip: 'Ask about the DOT tire date codes and dry rot cracking.',
    buyerChecklistItems: [
      'What are the 4-digit manufacture date codes on the sidewalls (e.g. 2818 = mid 2018)?',
      'Are all 4 tires matching brand/size, especially critical on AWD/4WD drivetrains?',
      'Is there an intact spare tire, jack, and lug wrench in the vehicle?',
    ],
  },
  {
    category: 'electrical',
    title: 'Electrical / Window / Sensor Glitch',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Driver rear power window switch doesn’t work from the master switch.',
    buyerQuestionTip: 'Ask if there is any parasitic battery drain requiring jump-starts.',
    buyerChecklistItems: [
      'Does the battery hold charge if parked for 3–5 days without driving?',
      'Do all headlights, brake lights, turn signals, and hazard flashers function?',
      'Do power locks, power windows, and radio work reliably?',
    ],
  },
  {
    category: 'cosmetic',
    title: 'Cosmetic / Dents / Scratches',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Clear coat peeling on hood and roof. Dent in rear passenger quarter panel.',
    buyerQuestionTip: 'Check if panels align and if doors/hatch seal shut tightly against water.',
    buyerChecklistItems: [
      'Do all doors, tailgate/trunk, and hood open and latch securely?',
      'Is there any water leak into the cabin or trunk during heavy rain or car washes?',
      'Is interior upholstery or dashboard cracked/torn from sun exposure?',
    ],
  },
  {
    category: 'accident',
    title: 'Past Accident / Body Repair',
    defaultSeverity: 'moderate',
    descriptionPlaceholder: 'e.g. Fender bender in 2019 replaced front bumper cover and headlight. No frame damage.',
    buyerQuestionTip: 'Ask for photos of past damage and verification of wheel alignment.',
    buyerChecklistItems: [
      'Was the damage purely cosmetic bolt-on parts (fender, bumper) or structural frame?',
      'Did airbags deploy during the accident?',
      'Does the vehicle track straight with proper wheel alignment specs?',
    ],
  },
  {
    category: 'no_run',
    title: 'Does Not Currently Run',
    defaultSeverity: 'critical',
    descriptionPlaceholder: 'e.g. Cranks strong with a jump but doesn’t fire. Needs fuel pump or ignition coil.',
    buyerQuestionTip: 'Ask what happens when the key turns (cranks vs dead silence) and when it last drove.',
    buyerChecklistItems: [
      'Does the starter motor crank the engine freely, or is the engine seized/locked up?',
      'When was the last time the vehicle was started and driven under its own power?',
      'Will you need a flatbed tow truck or winch to load it onto a trailer?',
    ],
  },
  {
    category: 'modified',
    title: 'Aftermarket Modifications',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. 2.5” suspension lift kit, aftermarket cold air intake, aftermarket stereo.',
    buyerQuestionTip: 'Ask if OEM stock parts are included and who performed the installation.',
    buyerChecklistItems: [
      'Were modifications installed professionally or DIY in a garage?',
      'Are original factory stock parts included in the sale?',
      'Are there wiring splices, ECU tuning, or catalytic converter deletes?',
    ],
  },
  {
    category: 'project',
    title: 'Project Car / Incomplete',
    defaultSeverity: 'major',
    descriptionPlaceholder: 'e.g. Interior partially disassembled for rust repair. Most parts boxed in trunk.',
    buyerQuestionTip: 'Confirm an inventory of loose parts, fasteners, and missing trim.',
    buyerChecklistItems: [
      'Are all disassembled parts, bolts, and hardware labeled and accounted for?',
      'What specific tools or shop equipment will be required to get it back on the road?',
      'Is the title present in the seller’s name ready to transfer without liens?',
    ],
  },
  {
    category: 'needs_maintenance',
    title: 'Overdue Maintenance',
    defaultSeverity: 'minor',
    descriptionPlaceholder: 'e.g. Due for an oil change, air filter, and spark plugs. Timing belt age unknown.',
    buyerQuestionTip: 'Ask about the timing belt/chain service history to prevent catastrophic engine failure.',
    buyerChecklistItems: [
      'Does this engine have an interference timing belt, and has it been replaced within interval?',
      'When were differential, transfer case, or brake fluids last flushed?',
      'Has the battery been tested for cold cranking amps recently?',
    ],
  },
];

/**
 * Dynamically compiles smart buyer questions based on the exact issues disclosed by the seller
 */
export function generateBuyerInspectionQuestions(issues: DisclosedIssue[]): {
  headline: string;
  items: { issueTitle: string; question: string }[];
} {
  if (!issues || issues.length === 0) {
    return {
      headline: 'Standard Pre-Purchase Inspection Questions',
      items: [
        {
          issueTitle: 'Overall Health',
          question: 'Do you have maintenance records or receipts for recent oil changes and wear items?',
        },
        {
          issueTitle: 'Title & Ownership',
          question: 'Is the title clean and physically in your name without any active bank liens?',
        },
        {
          issueTitle: 'Cold Start',
          question: 'Can you ensure the vehicle has NOT been warmed up prior to arrival so we can test a genuine cold start?',
        },
      ],
    };
  }

  const generatedQuestions: { issueTitle: string; question: string }[] = [];

  issues.forEach((issue) => {
    const preset = ISSUE_PRESETS.find((p) => p.category === issue.category);
    if (preset && preset.buyerChecklistItems.length > 0) {
      // Pick top 1 or 2 high-impact questions for this issue
      const picked = preset.buyerChecklistItems[0];
      generatedQuestions.push({
        issueTitle: issue.title,
        question: picked,
      });

      if (preset.buyerChecklistItems[1] && (issue.severity === 'major' || issue.severity === 'critical')) {
        generatedQuestions.push({
          issueTitle: issue.title,
          question: preset.buyerChecklistItems[1],
        });
      }
    } else {
      generatedQuestions.push({
        issueTitle: issue.title,
        question: `Ask how long this has been happening and whether it affects safe daily driving.`,
      });
    }
  });

  return {
    headline: `Smart In-Person Questions for this Whip (${issues.length} Disclosed Items)`,
    items: generatedQuestions,
  };
}
