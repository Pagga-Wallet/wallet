import clsx from "clsx";
import { emojiList } from "@/shared/lib/emoji";
import styles from "./Emoji.module.scss";

export interface EmojiListProps {
    onSelect(id: number): void;
    value?: number;
}

export const EmojiList = ({ onSelect, value }: EmojiListProps) => {
    return (
        <div className={styles.list}>
            {emojiList.map((emoji, index) => (
                <button
                    className={clsx(styles.list__item, {
                        [styles["item--active"]]: value === index,
                    })}
                    key={index}
                    onClick={() => {
                        onSelect?.(index);
                    }}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};
