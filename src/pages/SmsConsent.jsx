export default function SmsConsent() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-[#1B2F5E] py-4 px-6 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-12 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-white text-xl font-bold tracking-tight">RecoverJob</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 flex flex-col gap-10">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1B2F5E] mb-2">SMS Consent &amp; Messaging Disclosure</h1>
          <p className="text-gray-500 text-sm">Last updated: May 2026</p>
        </div>

        {/* Section 1 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-lg font-semibold text-[#1B2F5E] mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2F5E] text-white text-xs font-bold">1</span>
            About RecoverJob SMS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            RecoverJob is a SaaS platform that sends automated SMS messages on behalf of trades businesses
            (plumbers, HVAC, electricians, etc.) to individuals who called that business and did not reach
            anyone. Messages are sent as a direct transactional response to the caller's inbound service
            request.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-lg font-semibold text-[#1B2F5E] mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2F5E] text-white text-xs font-bold">2</span>
            How Consent Works
          </h2>

          <div className="flex flex-col gap-5">
            {/* Option 1 */}
            <div className="rounded-xl border border-[#4CAF29]/30 bg-[#4CAF29]/5 p-5">
              <h3 className="font-semibold text-[#1B2F5E] mb-2">Option 1 — Advance Notice (Explicit Consent)</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Businesses using RecoverJob are strongly encouraged to notify their customers before
                activation. The notification states:
              </p>
              <blockquote className="border-l-4 border-[#4CAF29] pl-4 italic text-gray-600 text-sm leading-relaxed mb-3">
                "We've partnered with RecoverJob to ensure we never miss your calls. When you call and
                we're unavailable, you may receive an automated text acknowledgment on our behalf. Reply
                STOP to opt out at any time, or reply OPT-OUT to this email to be excluded entirely."
              </blockquote>
              <p className="text-gray-700 text-sm leading-relaxed">
                Customers who opt out in advance are permanently added to a do-not-text list and never
                receive automated messages.
              </p>
            </div>

            {/* Option 2 */}
            <div className="rounded-xl border border-[#1B2F5E]/20 bg-[#1B2F5E]/5 p-5">
              <h3 className="font-semibold text-[#1B2F5E] mb-2">Option 2 — Inbound Call (Implied Consent)</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                When a customer voluntarily places an inbound call to a business and does not reach
                anyone, the call forwards to a RecoverJob-managed number. RecoverJob checks the
                do-not-text list, then sends a single transactional SMS on behalf of the business
                acknowledging the missed call. The voluntary inbound call establishes an existing
                business relationship and implied consent for a transactional response under TCPA.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — Example Messages */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-lg font-semibold text-[#1B2F5E] mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2F5E] text-white text-xs font-bold">3</span>
            Example Messages
          </h2>

          {/* Phone mockup */}
          <div className="mx-auto max-w-sm bg-gray-900 rounded-3xl p-4 shadow-xl">
            {/* Status bar */}
            <div className="flex justify-between items-center px-2 mb-3">
              <span className="text-gray-400 text-xs">Bob's Plumbing</span>
              <span className="text-gray-400 text-xs">SMS</span>
            </div>

            <div className="flex flex-col gap-3 px-1">
              {/* Message 1 — business (left) */}
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white text-sm rounded-2xl rounded-bl-md px-4 py-3 max-w-[82%] leading-relaxed">
                  Hi, this is Bob's Plumbing. Sorry we missed your call. We'll get back to you as soon
                  as possible. What can we help you with? Reply STOP to opt out.
                </div>
              </div>

              {/* Message 2 — business (left) */}
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white text-sm rounded-2xl rounded-bl-md px-4 py-3 max-w-[82%] leading-relaxed">
                  Bob's Plumbing here — we still want to help. Please call us back or reply here
                  with details. Reply STOP to opt out.
                </div>
              </div>

              {/* Message 3 — business reply (right, green) */}
              <div className="flex justify-end">
                <div className="bg-[#4CAF29] text-white text-sm rounded-2xl rounded-br-md px-4 py-3 max-w-[82%] leading-relaxed">
                  Hi, this is Bob from Bob's Plumbing. Got your message — when's a good time to call
                  you back? Reply STOP to opt out.
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-xs text-center mt-4 px-2">
              Sample messages shown above represent real outbound SMS sent on behalf of business clients.
            </p>
          </div>
        </section>

        {/* Section 4 — Message Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-lg font-semibold text-[#1B2F5E] mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2F5E] text-white text-xs font-bold">4</span>
            Message Details
          </h2>

          <div className="divide-y divide-gray-100">
            {[
              { label: 'Frequency', value: '1–2 messages per missed call' },
              { label: 'Rates', value: 'Message and data rates may apply' },
              { label: 'Opt-Out', value: 'Reply STOP to any message (honored immediately)' },
              { label: 'Help', value: 'Reply HELP for assistance' },
              { label: 'Data', value: 'Mobile numbers are never shared with third parties for marketing purposes' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 py-3">
                <span className="w-24 shrink-0 text-sm font-semibold text-[#1B2F5E]">{label}</span>
                <span className="text-sm text-gray-700 leading-relaxed">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Legal Documents */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-lg font-semibold text-[#1B2F5E] mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2F5E] text-white text-xs font-bold">5</span>
            Legal Documents
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://recoverjob.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-[#1B2F5E] text-white rounded-xl px-6 py-3 font-semibold text-sm hover:bg-[#15254d] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Privacy Policy
            </a>
            <a
              href="https://recoverjob.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 border-2 border-[#1B2F5E] text-[#1B2F5E] rounded-xl px-6 py-3 font-semibold text-sm hover:bg-[#1B2F5E]/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms &amp; Conditions
            </a>
          </div>
        </section>

        {/* Section 6 — Contact */}
        <section className="bg-[#1B2F5E] rounded-2xl p-7 text-center">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold">6</span>
            Contact
          </h2>
          <p className="text-blue-200 text-sm mb-4">Questions about our messaging practices?</p>
          <a
            href="mailto:support@recoverjob.com"
            className="inline-flex items-center gap-2 bg-[#4CAF29] text-white rounded-xl px-6 py-3 font-semibold text-sm hover:bg-[#3d9422] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@recoverjob.com
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-xs pb-4">
          © {new Date().getFullYear()} RecoverJob. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
