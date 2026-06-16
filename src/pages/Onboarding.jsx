import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RECOVERJOB_NUMBER = '(385) 220-7651';

const CARRIERS = ['iPhone', 'Android', 'AT&T', 'Verizon', 'T-Mobile'];

const INSTRUCTIONS = {
  iPhone: {
    note: 'This forwards ALL calls. To only forward missed calls, use the AT&T, Verizon, or T-Mobile tab for your carrier instead.',
    steps: [
      'Open your iPhone <strong>Settings</strong> app.',
      'Scroll down and tap <strong>Phone</strong>.',
      'Tap <strong>Call Forwarding</strong>.',
      'Toggle <strong>Call Forwarding ON</strong>.',
      'Tap <strong>Forward To</strong>.',
      'Enter <strong>(385) 220-7651</strong>.',
      "Tap the back arrow — you're done!",
    ],
    cancel: null,
  },
  Android: {
    note: 'Steps may vary slightly by phone brand (Samsung, Pixel, etc.). Look for "Call Forwarding" or "Supplementary Services" in your Phone app settings.',
    steps: [
      'Open your <strong>Phone</strong> app.',
      'Tap the <strong>three dots ⋮</strong> (menu) in the top right.',
      'Tap <strong>Settings</strong>.',
      'Tap <strong>Call Forwarding</strong> or <strong>Supplementary Services</strong>.',
      'Tap <strong>Forward when unanswered</strong>.',
      'Enter <strong>(385) 220-7651</strong>.',
      "Tap <strong>Enable</strong> — you're done!",
    ],
    cancel: null,
  },
  'AT&T': {
    note: null,
    steps: [
      'From your AT&T phone, open the <strong>dial pad</strong>.',
      'Dial: <strong>*61*3852207651#</strong>',
      'Press <strong>Call</strong>.',
      "You'll hear a confirmation tone.",
      "That's it — missed calls will now forward automatically!",
    ],
    cancel: 'To turn off: Dial <strong>#61#</strong> and press Call.',
  },
  Verizon: {
    note: null,
    steps: [
      'From your Verizon phone, open the <strong>dial pad</strong>.',
      'Dial: <strong>*71</strong> then <strong>3852207651</strong>',
      'Press <strong>Call</strong>.',
      'Wait for the confirmation tone.',
      "Done — missed calls forward automatically!",
    ],
    cancel: 'To turn off: Dial <strong>*73</strong> and press Call.',
  },
  'T-Mobile': {
    note: null,
    steps: [
      'From your T-Mobile phone, open the <strong>dial pad</strong>.',
      'Dial: <strong>**61*3852207651*11*20#</strong>',
      'Press <strong>Call</strong>.',
      "You'll get a confirmation message.",
      "Done!",
    ],
    cancel: 'To turn off: Dial <strong>##61#</strong> and press Call.',
  },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('iPhone');
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    navigator.clipboard.writeText('3852207651').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const current = INSTRUCTIONS[activeTab];

  return (
    <div className="min-h-screen bg-[#f3f4f6]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Header */}
      <div className="bg-[#1B2F5E] px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-10 w-auto mx-auto mb-6"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="inline-flex items-center gap-2 bg-[#4CAF29]/20 text-[#7ed659] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            Account Created
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            Welcome to RecoverJob!
          </h1>
          <p className="text-[#93aed8] text-base leading-relaxed max-w-lg mx-auto">
            You're almost set up. Just forward your missed calls to your RecoverJob number and you'll never lose a lead again.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Number card */}
        <div className="bg-[#1B2F5E] rounded-2xl p-6 text-center shadow-lg">
          <p className="text-[#93aed8] text-sm font-medium mb-2">Your RecoverJob Number</p>
          <p className="text-[#4CAF29] text-5xl font-black tracking-tight mb-5">
            {RECOVERJOB_NUMBER}
          </p>
          <button
            onClick={copyNumber}
            className="inline-flex items-center gap-2 bg-[#4CAF29] hover:bg-[#3d9922] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Number
              </>
            )}
          </button>
        </div>

        {/* Instructions card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-6 pb-0">
            <h2 className="text-lg font-bold text-[#1B2F5E] mb-1">Set Up Call Forwarding</h2>
            <p className="text-sm text-gray-500 mb-5">
              Choose your phone or carrier below for step-by-step instructions.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {CARRIERS.map((carrier) => (
              <button
                key={carrier}
                onClick={() => setActiveTab(carrier)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === carrier
                    ? 'border-[#4CAF29] text-[#1B2F5E]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {carrier}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="px-6 py-6">
            {current.note && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-5 leading-relaxed">
                {current.note}
              </div>
            )}
            <ol className="flex flex-col gap-4">
              {current.steps.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e8f5e2] text-[#2d7a18] text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span
                    className="text-sm text-gray-700 leading-relaxed pt-1"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </li>
              ))}
            </ol>
            {current.cancel && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p
                  className="text-xs text-gray-500"
                  dangerouslySetInnerHTML={{ __html: current.cancel }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Test section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-[#1B2F5E] mb-2">Test Your Setup</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Call your business number from another phone and don't answer. You should receive a text back within 15 seconds.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#4CAF29] hover:bg-[#3d9922] text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
          >
            I've Set It Up — Test It Now →
          </button>
        </div>

        {/* Skip + footer */}
        <div className="text-center flex flex-col gap-3 pb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            I'll set this up later
          </button>
          <p className="text-xs text-gray-400">
            Need help?{' '}
            <a href="mailto:support@recoverjob.com" className="text-[#4CAF29] hover:underline font-medium">
              Email us at support@recoverjob.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
