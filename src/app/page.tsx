// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert h-5 w-[100px]"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the{" "}
//             <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
//               page.tsx
//             </code>{" "}
//             file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert h-[14px] w-4"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={14}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="text-2xl">📸</span>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-yellow-600 to-orange-300 bg-clip-text text-transparent">
              Pilihin
            </span> */}
            {/* Brand */}
                    <Link
                         href={process.env.NEXT_PUBLIC_SITE_URL || '/'}
                        className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--proof)]"
                    >
                      <FrameMark />                        

                        <span className="font-display text-lg font-bold tracking-tight text-[var(--proof)]">
                            pilihin
                            <span className="text-[var(--proof)]">.</span>
                        </span>
                    </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-medium text-white bg-[var(--proof)] hover:bg-[var(--proof-strong)] px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto leading-tight">
            Galeri Foto Eksklusif Anda, <span className="bg-gradient-to-r from-yellow-500 to-orange-300 bg-clip-text text-transparent">Amankan Kenangan</span> Terbaik
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform khusus klien untuk melihat, mengunduh, dan membagikan hasil foto berkualitas tinggi dari sesi fotografi Anda dengan aman dan mudah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="w-full sm:w-auto text-center font-semibold text-white bg-[var(--proof)] hover:bg-[var(--proof-strong)] px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200"
            >
              Mulai Akses Album
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto text-center font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-8 py-4 rounded-xl transition-all"
            >
              Masuk sebagai Klien
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Menggunakan Platform Kami?</h2>
              <p className="text-slate-600 max-w-xl mx-auto">Kami memastikan setiap momen berharga Anda tersimpan dan tersampaikan dengan kualitas terbaik.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Privasi Terjamin</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Setiap album dilindungi oleh sistem enkripsi dan hanya dapat diakses oleh klien yang memiliki akun resmi.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl mb-4">✨</div>
                <h3 className="text-xl font-bold mb-2">Kualitas Penuh</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Unduh foto Anda dalam resolusi penuh tanpa kompresi, siap untuk dicetak kapan saja.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Pilih & Tandai</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Sistem seleksi interaktif yang memudahkan Anda memilih foto favorit untuk proses editing lanjutan.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">📸</span>
            <span className="font-bold tracking-tight">LensVault</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} LensVault. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );

}

function FrameMark() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
        >
            <path
                d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16"
                stroke="var(--proof)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <circle
                cx="12"
                cy="12"
                r="3.1"
                stroke="var(--proof)"
                strokeWidth="1.6"
            />
        </svg>
    );
}
