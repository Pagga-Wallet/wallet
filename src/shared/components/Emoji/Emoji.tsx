import clsx from "clsx";
import { emojiList } from "@/shared/lib/emoji";

export interface EmojiProps {
    id: number;
    className?: string;
}

export const Emoji = ({ id, className }: EmojiProps) => {
    return (
        <span className={clsx("emoji", className)} key={id}>
            {emojiList[id]}
        </span>
    );
};
