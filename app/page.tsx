import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HomeTabs from "@/components/HomeTabs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroBanner />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <HomeTabs />
        </div>
      </main>
    </div>
  );
}
