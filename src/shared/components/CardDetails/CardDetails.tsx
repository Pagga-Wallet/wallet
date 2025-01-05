import styles from "./CardDetails.module.scss";

type Property = {
    name: string;
    value: string | undefined;
};

interface CardDetailsProps {
    sections: {
        title: string;
        properties: Property[];
    }[];
}

export const CardDetails = ({ sections }: CardDetailsProps) => {
    return (
        <div className={styles.card}>
            {sections.map(({ title, properties }) => (
                <div className={styles.section}>
                    {/* <span className={styles.section__name}>{title}</span> */}
                    <div className={styles.section__properties}>
                        {properties.map((property) => (
                            <div className={styles.property}>
                                <span className={styles.property__name}>{property.name}</span>
                                <span className={styles.property__value}>{property.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
