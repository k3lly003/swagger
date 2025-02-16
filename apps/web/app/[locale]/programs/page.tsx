import { getDictionary } from "@/lib/get-dictionary";

export default async function ProgramsPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const dict = await getDictionary(locale);

  return (
    <main>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Overview</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Overview of our various programs and initiatives.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">This is the Programs Page</h2>
        <p className="text-muted-foreground">
          This is a simple placeholder for content about GanzAfrica's programs.
        </p>
      </div>
    </main>
  );
}
