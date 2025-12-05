"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FlaskConical, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))] rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))] shadow-lg">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold gradient-text">Lockbox Notes</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Encrypted Research Notebook
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            <span className="text-xs font-medium text-[hsl(var(--success))]">FHE Protected</span>
          </div>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="px-4 py-2 rounded-xl font-medium text-sm bg-gradient-to-r from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-4 py-2 rounded-xl font-medium text-sm bg-destructive text-destructive-foreground"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <Image
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              width={16}
                              height={16}
                              className="w-4 h-4 rounded-full"
                            />
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium glass-card hover:bg-card/90 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-purple))]" />
                          <span className="hidden sm:inline">{account.displayName}</span>
                          <span className="sm:hidden">{account.displayName.slice(0, 6)}...</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
