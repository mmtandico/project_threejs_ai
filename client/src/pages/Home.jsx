import { useSnapshot } from 'valtio';
import { useRef } from 'react';

import state from '../store';
import { CustomButton, MiniShirtPreview } from '../components';
import { PresetDesigns } from '../config/constants';

const Home = () => {
  const snap = useSnapshot(state);
  const collectionScrollRef = useRef(null);

  if (!snap.intro) return null;

  return (
    <section
      id="home"
      className="home bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6">
        {/* Top nav */}
        <header className="flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-3">
            <img
              src="./XillaLogo.png"
              alt="Xillogo"
              className="w-24 h-24 object-contain"
            />
            <span className="font-semibold tracking-wide uppercase text-slate-100">
              XillaFit
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-[11px]">
              <button
                className="hover:text-white"
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Home
              </button>
              <button
                className="hover:text-white"
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Collection
              </button>
              <button
                className="hover:text-white"
                onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Templates
              </button>
              <button
                className="hover:text-white"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                About us
              </button>
              <button
                className="hover:text-white"
                onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Support
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex text-[11px] font-semibold text-slate-200 hover:text-white">
                Sign in
              </button>
              <CustomButton
                type="filled"
                title="Start now"
                handleClick={() => (state.intro = false)}
                customStyles="px-4 py-1.5 text-[11px] font-semibold bg-amber-400 hover:bg-amber-300"
              />
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="home-content">
          <div className="flex-1 flex flex-col items-start gap-5 text-slate-100">
            <span className="text-[11px] tracking-[0.25em] uppercase text-sky-300">
              Collection 01 • XillaFit Arctic Tees
            </span>
            <h1 className="head-text text-slate-50">
              Cold‑ready<br className="hidden lg:block" /> 3D shirt studio.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-200/80 leading-relaxed">
              Explore our latest collection of premium 3D T‑shirt mockups. Pick a style,
              drop in your logo or artwork, and visualize every fold and highlight
              before you launch.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <CustomButton
                type="filled"
                title="Customize a shirt"
                handleClick={() => (state.intro = false)}
                customStyles="px-5 py-2.5 font-semibold text-sm bg-sky-400 hover:bg-sky-300"
              />
              <button
                type="button"
                onClick={() => (state.intro = false)}
                className="text-sm font-semibold text-slate-200 hover:text-white underline-offset-4 hover:underline"
              >
                View live collection
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl overflow-hidden">
              <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[11px] text-slate-50/90">
                <span>Collection Arctic 01™</span>
                <span>3D Mockup • Live</span>
              </div>
              <div className="absolute inset-0">
                {/* Landing page uses its own preset-driven 3D preview */}
                <MiniShirtPreview preset={PresetDesigns[1] || PresetDesigns[0]} />
              </div>
              <div className="absolute left-6 bottom-5 text-[11px] text-slate-100/80">
                <p className="font-semibold">XillaFit Hero Tee</p>
                <p className="text-slate-200/70">Landing preview • Linked to presets</p>
                <p className="mt-1 text-sky-100">$39.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Collection – horizontal scroll */}
        <section
          id="collection"
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-wide text-slate-100 uppercase">
              New collection
            </h2>
            <button className="px-3 py-1 rounded-full border border-slate-600 text-[11px] text-slate-200 hover:bg-slate-700/60">
              Filters
            </button>
          </div>

          <div
            className="relative -mx-4 sm:-mx-6 px-4 sm:px-6"
          >
            {/* Left arrow */}
            <button
              type="button"
              aria-label="Previous shirts"
              onClick={() => {
                const container = collectionScrollRef.current;
                if (!container) return;
                const amount = container.clientWidth * 0.7;
                container.scrollBy({ left: -amount, behavior: 'smooth' });
              }}
              className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-600 text-slate-100 hover:bg-slate-800 hover:border-slate-400 shadow-lg"
            >
              ‹
            </button>

            {/* Right arrow */}
            <button
              type="button"
              aria-label="Next shirts"
              onClick={() => {
                const container = collectionScrollRef.current;
                if (!container) return;
                const amount = container.clientWidth * 0.7;
                container.scrollBy({ left: amount, behavior: 'smooth' });
              }}
              className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-600 text-slate-100 hover:bg-slate-800 hover:border-slate-400 shadow-lg"
            >
              ›
            </button>

            <div
              ref={collectionScrollRef}
              className="collection-scroll-row flex gap-5 overflow-x-auto pb-3 custom-scrollbar scroll-smooth"
            >
              {PresetDesigns.map((preset) => (
                <div
                  key={preset.id}
                  className="min-w-[220px] sm:min-w-[260px] rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg overflow-hidden flex flex-col"
                >
                  <div className="w-full aspect-[4/3] bg-slate-900/60">
                    <MiniShirtPreview preset={preset} />
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-1 text-[11px] text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-50">
                        {preset.name}
                      </span>
                      <span className="text-sky-300">$39</span>
                    </div>
                    <p className="text-slate-300/80">
                      Mockup‑ready tee • Custom {preset.isFullTexture ? 'full print' : 'logo placement'}.
                    </p>
                    <button
                      type="button"
                      onClick={() => (state.intro = false)}
                      className="mt-2 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-sky-500 text-[11px] font-semibold text-slate-900 hover:bg-sky-400"
                    >
                      Customize this
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates section */}
        <section
          id="templates"
          className="mt-10 flex flex-col gap-4"
        >
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-slate-100 uppercase">
            Templates
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Start faster with ready-made shirt layouts. Swap colors, logos and details in seconds
            while keeping proportions, spacing and presentation polished.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-2 text-[11px] text-slate-200">
              <span className="font-semibold text-slate-50">Brand launch</span>
              <span className="text-slate-300/90">
                Hero tee, secondary colorway and detail close‑up for new drops.
              </span>
            </div>
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-2 text-[11px] text-slate-200">
              <span className="font-semibold text-slate-50">Team packs</span>
              <span className="text-slate-300/90">
                Matching home / away shirts with number and logo positions pre‑set.
              </span>
            </div>
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4 flex flex-col gap-2 text-[11px] text-slate-200">
              <span className="font-semibold text-slate-50">Merch bundles</span>
              <span className="text-slate-300/90">
                Social‑ready scenes for storefronts, drops and promo campaigns.
              </span>
            </div>
          </div>
        </section>

        {/* About us section */}
        <section
          id="about"
          className="mt-10 flex flex-col gap-4"
        >
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-slate-100 uppercase">
            About us
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-sm text-slate-300">
              <p>
                XillaFit is built for creators who care about detail. We combine real‑world garment
                shading with an intuitive 3D workspace so your shirts look printed before they ever leave
                the screen.
              </p>
              <p>
                Whether you&apos;re launching a brand, designing for a team, or refreshing your store,
                our live previews help you move from idea to finished mockup without complex tools.
              </p>

              <div className="pt-2 border-t border-slate-700/70 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-slate-100 tracking-wide uppercase">
                  Our locations
                </p>
                <p>
                  <span className="font-semibold text-slate-100">Shop location:</span>{' '}
                  229 Gonzales Subdivision, Barangay Abangan Sur, Marilao, Bulacan
                </p>
                <p>
                  <span className="font-semibold text-slate-100">Business address:</span>{' '}
                  3620 MacArthur Highway, Abangan Sur, Marilao, Bulacan
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/70 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-slate-100 tracking-wide uppercase">
                  Connect with us
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/bowtchsportswear"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-600 text-[11px] font-semibold text-slate-100 hover:bg-slate-700 hover:border-sky-400 transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.tiktok.com/@bowtchsportswear"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-600 text-[11px] font-semibold text-slate-100 hover:bg-slate-700 hover:border-sky-400 transition-colors"
                  >
                    TikTok
                  </a>
                  <a
                    href="mailto:bowtchsportswear@gmail.com"
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-600 text-[11px] font-semibold text-slate-100 hover:bg-slate-700 hover:border-sky-400 transition-colors"
                  >
                    Gmail
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72 lg:h-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/60 shadow-xl">
              <iframe
                title="XillaFit location on Google Maps"
                src="https://www.google.com/maps?q=3620+MacArthur+Highway,+Abangan+Sur,+Marilao,+Bulacan&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 mb-6 border-t border-slate-800 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold tracking-wide uppercase">
              XillaFit
            </span>
            <span className="text-slate-500">• Custom sportswear & mockups</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-500">
              © {new Date().getFullYear()} XillaFit. All rights reserved.
            </span>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/bowtchsportswear"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-200"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/@bowtchsportswear"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-200"
              >
                TikTok
              </a>
              <a
                href="mailto:bowtchsportswear@gmail.com"
                className="hover:text-slate-200"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Home;