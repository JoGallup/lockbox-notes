"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExperimentNotebook } from "@/components/ExperimentNotebook";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Database, Users, FlaskConical, Sparkles, ArrowRight, Zap } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pattern-dots opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--lab-blue))]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--lab-teal))]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--lab-purple))]/5 rounded-full blur-3xl" />
          
          {/* Hero Section */}
          <section className="relative z-10 py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lab-blue))]/10 border border-[hsl(var(--lab-blue))]/20">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--lab-blue))]" />
                  <span className="text-sm font-medium text-[hsl(var(--lab-blue))]">Powered by Zama FHE</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    Your Research,{" "}
                    <span className="gradient-text">Encrypted by Default</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Store experiment notes, datasets, and research parameters with field-level encryption.
                    Collaborate securely with selective decryption.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => (
                      <button
                        onClick={openConnectModal}
                        disabled={!mounted}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <FlaskConical className="h-5 w-5" />
                        Start Your Notebook
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </ConnectButton.Custom>
                  <a
                    href="https://docs.zama.ai/fhevm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-foreground border border-border hover:bg-secondary/50 transition-colors"
                  >
                    Learn About FHE
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4 text-[hsl(var(--encrypted))]" />
                    <span className="text-sm">End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4 text-[hsl(var(--lab-amber))]" />
                    <span className="text-sm">On-Chain Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-[hsl(var(--success))]" />
                    <span className="text-sm">Wallet-Based Keys</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative z-10 py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Lockbox Notes?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Built for researchers who need privacy without compromising on collaboration
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group p-6 hover-lift glow-effect bg-gradient-to-br from-[hsl(var(--lab-blue))]/20 to-[hsl(var(--lab-blue))]/5 border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--lab-blue))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-[hsl(var(--lab-blue))]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Field-Level Encryption</h3>
                  <p className="text-sm text-muted-foreground">Encrypt sensitive data fields individually with FHE technology</p>
                </Card>
                <Card className="group p-6 hover-lift glow-effect bg-gradient-to-br from-[hsl(var(--encrypted))]/20 to-[hsl(var(--encrypted))]/5 border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--encrypted))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lock className="h-6 w-6 text-[hsl(var(--encrypted))]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Wallet-Based Keys</h3>
                  <p className="text-sm text-muted-foreground">Your wallet manages all encryption keys securely</p>
                </Card>
                <Card className="group p-6 hover-lift glow-effect bg-gradient-to-br from-[hsl(var(--lab-teal))]/20 to-[hsl(var(--lab-teal))]/5 border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--lab-teal))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Database className="h-6 w-6 text-[hsl(var(--lab-teal))]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Research Notebooks</h3>
                  <p className="text-sm text-muted-foreground">Organize experiments, findings, and datasets efficiently</p>
                </Card>
                <Card className="group p-6 hover-lift glow-effect bg-gradient-to-br from-[hsl(var(--lab-amber))]/20 to-[hsl(var(--lab-amber))]/5 border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--lab-amber))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-[hsl(var(--lab-amber))]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Selective Sharing</h3>
                  <p className="text-sm text-muted-foreground">Control exactly who sees what data with granular permissions</p>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="relative z-10 py-16 px-4 bg-secondary/30">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground">Three simple steps to secure your research</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Connect Wallet",
                    description: "Link your Web3 wallet to authenticate and manage encryption keys"
                  },
                  {
                    step: "02",
                    title: "Create Experiments",
                    description: "Organize your research into experiments with multiple steps"
                  },
                  {
                    step: "03",
                    title: "Encrypt & Store",
                    description: "Your data is encrypted on-chain, accessible only to you"
                  }
                ].map((item, index) => (
                  <div key={index} className="relative text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))] text-white font-bold text-xl mb-4 shadow-lg">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative z-10">
          <ExperimentNotebook />
        </div>
      </main>
      <Footer />
    </div>
  );
}
