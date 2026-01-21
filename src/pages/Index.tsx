import { Hero } from "@/components/Hero";
import { Workflow } from "@/components/Workflow";
import { Features } from "@/components/Features";
import { Terminal } from "@/components/Terminal";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Workflow />
      <Features />
      <Terminal />
      <Footer />
    </div>
  );
};

export default Index;
