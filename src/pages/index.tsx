import { Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AccountPage } from "./AccountPage";
import { ConnectConfirm } from "./ConnectConfirm/ui/ConnectConfirm";
import { ConnectOpenPage } from "./ConnectOpenPage/ui/ConnectOpenPage";
import { ConnectTransactionFailed } from "./ConnectTransactionFailed/ui/ConnectTransactionFailed";
import { ConnectTransactionSuccess } from "./ConnectTransactionSuccess/ui/ConnectTransactionSuccess";
import { ConnectWalletListPage } from "./ConnectWalletListPage";
import { CreateMnemonicPage } from "./CreateMnemonicPage";
import { Home } from "./Home/ui/Home";
import { ImportMnemonicPage } from "./ImportMnemonicPage";
import { ImportTokenPage } from "./ImportTokenPage";
import { NftDetail } from "./NftDetail/NftDetail";
import { NftSendPage } from "./NftSendPage/";
import { ReceivePage } from "./ReceivePage";
import { RecoveryPhrasePage } from "./RecoveryPhrasePage/RecoveryPhrasePage";
import { Send } from "./Send";
import { SettingsPage } from "./Settings";
import { TokenDetail } from "./TokenDetail";
import { TransactionPage } from "./TransactionPage";
import { WelcomePage } from "./WelcomePage/WelcomePage";
import { PrivacyPolicy } from "./PrivacyPolicy/ui";
import { Apps } from "./Apps/ui/Apps";
import { PointsPage } from "./PointsPage/PointsPage";

// import { IntroductionPage } from "./IntroductionPage";
// import { RenewPage } from "./RenewPage/RenewPage";
// import { Swap } from "./Swap";

export const Routing = () => {
    return (
        <>
            <Suspense fallback={<></>}>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/create/mnemonic" element={<CreateMnemonicPage />} />
                    <Route path="/import/mnemonic" element={<ImportMnemonicPage />} />

                    <Route path="/token" element={<TokenDetail />} />
                    <Route path="/nft/:address" element={<NftDetail />} />
                    <Route path="/nft/send" element={<NftSendPage />} />

                    <Route path="/send" element={<Send />} />

                    <Route path="/apps" element={<Apps />} />

                    <Route path="/settings" element={<SettingsPage />} />

                    <Route path="/receive" element={<ReceivePage />} />

                    <Route path="/account/:id" element={<AccountPage />} />
                    <Route path="/account/:id/recovery" element={<RecoveryPhrasePage />} />

                    <Route path="privacy-policy" element={<PrivacyPolicy />} />

                    <Route path="/import/token" element={<ImportTokenPage />} />

                    <Route path="/connect/open" element={<ConnectOpenPage />} />
                    <Route path="/connect/confirm" element={<ConnectConfirm />} />
                    <Route path="/connect/success" element={<ConnectTransactionSuccess />} />
                    <Route path="/connect/failed" element={<ConnectTransactionFailed />} />
                    <Route
                        path="/connect/wallet-connect-list/:type"
                        element={<ConnectWalletListPage />}
                        />

                    <Route path="/points" element={<PointsPage />} />

                    {/* <Route path="/swap" element={<Swap />} /> */}
                    {/* <Route path="/introduction" element={<IntroductionPage />} />
                    <Route path="/introduction/renew" element={<RenewPage />} /> */}

                    <Route path="/transaction" element={<TransactionPage />} />
                </Routes>
            </Suspense>
        </>
    );
};
