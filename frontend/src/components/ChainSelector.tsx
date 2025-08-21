import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DexButton } from "@/components/ui/dex-button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Chain {
    id: number;
    name: string;
    logo?: string; // added logo here
    key: string;
}

import { CHAINS } from "../../../Backend/chain";

const chains: Chain[] = Object.entries(CHAINS).map(([key, val]) => ({
    key,
    id: val.id,
    name: val.name,
    logo: val.logo,
}));

interface ChainSelectorProps {
    label: string;
    selectedChainKey?: string;
    onChainSelect: (chainKey: string) => void;
}

const ChainSelector = ({
    label,
    selectedChainKey,
    onChainSelect,
}: ChainSelectorProps) => {
    const [open, setOpen] = useState(false);

    const selectedChain = chains.find((c) => c.key === selectedChainKey);

    return (
        <div className="space-y-2">
            <label className="text-sm text-dex-text-muted font-medium">{label}</label>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DexButton
                        variant="secondary"
                        className="w-full justify-between h-12 bg-dex-card hover:bg-dex-card-hover border border-border"
                    >
                        {selectedChain ? (
                            <div className="flex items-center gap-3">
                                {selectedChain.logo ? (
                                    <img
                                        src={selectedChain.logo}
                                        alt={`${selectedChain.name} logo`}
                                        className="w-6 h-6 rounded-full object-contain"
                                    />
                                ) : (
                                    <span className="text-lg">🔗</span>
                                )}
                                <div className="text-left">
                                    <div className="font-medium text-dex-text-primary">{selectedChain.name}</div>
                                    <div className="text-xs text-dex-text-muted">Chain ID: {selectedChain.id}</div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-dex-text-muted">Select chain</span>
                        )}
                        <ChevronDown className="h-4 w-4 text-dex-text-muted" />
                    </DexButton>
                </DialogTrigger>
                <DialogContent className="bg-dex-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-dex-text-primary">Select a chain</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {chains.map((chain) => (
                            <button
                                key={chain.key}
                                onClick={() => {
                                    onChainSelect(chain.key);
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-transparent hover:bg-dex-card-hover transition-colors"
                            >
                                {chain.logo ? (
                                    <img
                                        src={chain.logo}
                                        alt={`${chain.name} logo`}
                                        className="w-6 h-6 rounded-full object-contain"
                                    />
                                ) : (
                                    <span className="text-lg">🔗</span>
                                )}

                                <div className="text-left flex-1">
                                    <div className="font-medium text-dex-text-primary">{chain.name}</div>
                                    <div className="text-sm text-dex-text-muted">Chain ID: {chain.id}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChainSelector;
