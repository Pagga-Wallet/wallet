import { useTranslation } from "react-i18next";
import { useFetchNFTDetailsQuery } from "@/entities/nft/model/nftAPI";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import styles from "./CardCollection.module.scss";

export const CardCollection = ({ address }: { address: string }) => {
    const { t } = useTranslation();
    const { data: nftDetails } = useFetchNFTDetailsQuery({
        address,
    });
    return (
        <div className={styles.card}>
            <div className={styles.cardItem}>
                <div className={styles.cardItemTitle}>{t("nft-details.collection")}</div>
                <div className={styles.cardItemContent}>{nftDetails?.collection?.name}</div>
            </div>
            <div className={styles.cardItem}>
                <div className={styles.cardItemTitle}>{t("nft-details.network")}</div>
                <div className={styles.cardItemContent}>TON</div>
            </div>
            <div className={styles.cardItem}>
                <div className={styles.cardItemTitle}>{t("nft-details.details")}</div>
                <div className={styles.cardItemContent}>{smallAddress(nftDetails?.owner)}</div>
            </div>
            <div className={styles.cardItem}>
                <div className={styles.cardItemTitle}>{t("nft-details.address")}</div>
                <div className={styles.cardItemContent}>{smallAddress(nftDetails?.address)}</div>
            </div>
            
            {/* <div className={styles.section}>
                <span className={styles.section__name}>{t("nft-details.description")}</span>
                <div className={styles.section__properties}>
                    <div className={styles.property}>
                        <span className={styles.property__name}>{t("nft-details.collection")}</span>
                        <span className={styles.property__value}>
                            {nftDetails?.collection?.name}
                        </span>
                    </div>
                    <div className={styles.property}>
                        <span className={styles.property__name}>{t("nft-details.network")}</span>
                        <span className={styles.property__value}>TON</span>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <span className={styles.section__name}>{t("nft-details.details")}</span>
                <div className={styles.section__properties}>
                    <div className={styles.property}>
                        <span className={styles.property__name}>{t("nft-details.owner")}</span>
                        <span className={styles.property__value}>
                            {smallAddress(nftDetails?.owner)}
                        </span>
                    </div>
                    <div className={styles.property}>
                        <span className={styles.property__name}>{t("nft-details.address")}</span>
                        <span className={styles.property__value}>
                            {smallAddress(nftDetails?.address)}
                        </span>
                    </div>
                </div>
            </div> */}
        </div>
    );
};
