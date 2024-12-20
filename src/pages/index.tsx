import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountPage } from "./AccountPage";
import { ChangeTonVersion } from "./ChangeTonVersion";
import { ConnectConfirm } from "./ConnectConfirm/ui/ConnectConfirm";
import { ConnectOpenPage } from "./ConnectOpenPage/ui/ConnectOpenPage";
import { ConnectTransactionFailed } from "./ConnectTransactionFailed/ui/ConnectTransactionFailed";
import { ConnectTransactionSuccess } from "./ConnectTransactionSuccess/ui/ConnectTransactionSuccess";
import { ConnectWalletListPage } from "./ConnectWalletListPage";
import { CreateMnemonicPage } from "./CreateMnemonicPage";
import { Home } from "./Home/ui/Home";
import { ImportMnemonicPage } from "./ImportMnemonicPage";
import { ImportTokenPage } from "./ImportTokenPage";
import { IntroductionPage } from "./IntroductionPage";
import { NftDetail } from "./NftDetail/NftDetail";
import { NftSendPage } from "./NftSendPage/";
import { ReceivePage } from "./ReceivePage";
import { RecoveryPhrasePage } from "./RecoveryPhrasePage/RecoveryPhrasePage";
import { RenewPage } from "./RenewPage/RenewPage";
import { Send } from "./Send";
import { SettingsPage } from "./Settings";
import { Swap } from "./Swap";
import { TokenDetail } from "./TokenDetail";
import { TransactionPage } from "./TransactionPage";
import { WelcomePage } from "./WelcomePage/WelcomePage";

export const Routing = () => {
    return (
        <>
            <Suspense fallback={<>Loading</>}>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/create/mnemonic" element={<CreateMnemonicPage />} />
                    <Route path="/import/mnemonic" element={<ImportMnemonicPage />} />

                    <Route path="/token" element={<TokenDetail />} />
                    <Route path="/nft/:address" element={<NftDetail />} />
                    <Route path="/nft/send" element={<NftSendPage />} />

                    <Route path="/send" element={<Send />} />

                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/ton-version" element={<ChangeTonVersion />} />

                    <Route path="/receive" element={<ReceivePage />} />

                    <Route path="/account/:id" element={<AccountPage />} />
                    <Route path="/account/:id/recovery" element={<RecoveryPhrasePage />} />

                    {/* <Route path="/swap" element={<Swap />} /> */}

                    <Route path="/import/token" element={<ImportTokenPage />} />

                    <Route path="/connect/open" element={<ConnectOpenPage />} />
                    <Route path="/connect/confirm" element={<ConnectConfirm />} />
                    <Route path="/connect/success" element={<ConnectTransactionSuccess />} />
                    <Route path="/connect/failed" element={<ConnectTransactionFailed />} />
                    <Route
                        path="/connect/wallet-connect-list"
                        element={<ConnectWalletListPage />}
                    />

                    <Route path="/introduction" element={<IntroductionPage />} />
                    <Route path="/introduction/renew" element={<RenewPage />} />

                    <Route path="/transaction" element={<TransactionPage />} />
                </Routes>
            </Suspense>
        </>
    );
};
