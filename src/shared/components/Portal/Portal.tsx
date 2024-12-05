import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Portal {
    id: string;
    children: React.ReactNode;
}

export const Portal: FC<Portal> = ({ children, id }) => {
    const [container, setContainer] = useState<HTMLElement>();

    useEffect(() => {
        if (id) {
            const portalContainer = document.getElementById(id);

            if (!portalContainer) {
                throw new Error(
                    `There is no portal container in markup. Please add portal container with proper id attribute.`
                );
            }

            setContainer(portalContainer);
        }
    }, [id]);

    return container ? createPortal(children, container) : null;
};
