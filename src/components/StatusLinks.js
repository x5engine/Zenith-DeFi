import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';

/**
 * StatusLinks component - Displays transaction links to block explorers
 * This component shows clickable links to view transactions on testnet explorers
 */
const StatusLinks = observer(() => {
    const { exchangeStore } = useStores();
    const { evmTxHash, btcTxHash } = exchangeStore;

    const btcExplorerUrl = `https://mempool.space/testnet/tx/${btcTxHash}`;
    const evmExplorerUrl = `https://amoy.polygonscan.com/tx/${evmTxHash}`;

    return (
        <div className="transaction-links">
            {(evmTxHash || btcTxHash) && (
                <div className="links-header">
                    <h4>View Transactions</h4>
                </div>
            )}
            
            {evmTxHash && (
                <div className="link-item">
                    <a 
                        href={evmExplorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="explorer-link evm-link"
                    >
                        📋 View EVM Transaction on Polygonscan
                    </a>
                </div>
            )}
            
            {btcTxHash && (
                <div className="link-item">
                    <a 
                        href={btcExplorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="explorer-link btc-link"
                    >
                        ₿ View Bitcoin Transaction on Mempool
                    </a>
                </div>
            )}
        </div>
    );
});

export default StatusLinks;