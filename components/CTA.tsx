import { Button } from "@/components/ui/Button";
import { MascotArt } from "@/components/ui/MascotArt";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function CTA({ art }: { art: string | null }) {
  return (
    <section id="cta" className="relative isolate overflow-clip border-t border-ag-line">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#2b1259_0%,#1a0b3a_45%,#0d0a14_100%)]"
      />
      <div
        aria-hidden
        className="animate-glow absolute -left-[10%] top-1/2 -z-10 size-[42rem] max-w-[120vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(192_38_211/0.35),transparent_70%)]"
      />

      {art && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-8%] -z-10 hidden w-[42%] opacity-90 md:block"
        >
          <MascotArt src={art} alt="" float={false} sizes="40vw" className="absolute inset-0" />
        </div>
      )}

      <div className="shell py-24 lg:py-36">
        <Reveal className="max-w-[56rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-pink">
            Ready to run?
          </p>
          <h2 className="display-h mt-6">
            Bring Agemasen
            <br />
            to your WhatsApp.
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={site.waUrl} external size="lg" className="w-full sm:w-auto">
              Add Agemasen
            </Button>
            {site.githubUrl ? (
              <Button href={site.githubUrl} external variant="ghost" size="lg" className="w-full sm:w-auto">
                View GitHub
              </Button>
            ) : (
              <Button href="/home" variant="ghost" size="lg" className="w-full sm:w-auto">
                Lihat command
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
