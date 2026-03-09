import AppShell from "@/components/AppShell";

export default function IdagPage() {
  return (
    <AppShell activePath="/idag">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Idag</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Dagens uppföljningar visas här baserat på skickade offerter.
        </p>
      </div>
    </AppShell>
  );
}
