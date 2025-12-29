import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { HeroDemo } from "@/components/ui/hero-demo";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <HeroDemo />
      </div>
      <Footer
        logo={
          <img
            src="/logo.jpg"
            alt="库无忧助手"
            className="h-10 w-10 object-contain"
          />
        }
        brandName="库无忧助手"
        socialLinks={[]}
        mainLinks={[]}
        legalLinks={[]}
        copyright={{
          text: "© 2025 库无忧助手",
          license: "保留所有权利",
        }}
      />
    </div>
  );
}
