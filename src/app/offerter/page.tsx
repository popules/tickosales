import AppShell from "@/components/AppShell";

export default function OfferterPage() {
  return (
    <AppShell activePath="/offerter">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Offerter</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Skapa, exportera och skicka offerter. (MVP under uppbyggnad)
        </p>
      </div>
    </AppShell>
  );
}
