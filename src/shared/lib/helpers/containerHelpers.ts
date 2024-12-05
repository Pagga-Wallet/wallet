interface containerOptions {
    id: string;
    mountNode?: HTMLElement;
}
export const createContainer = (options: containerOptions) => {
    if (document.getElementById(options.id)) {
        return;
    }

    const { id, mountNode = document.body } = options;

    const portalContainer = document.createElement("div");
    portalContainer.setAttribute("id", id);
    portalContainer.setAttribute("data-testid", `portalContainer-${id}`);
    mountNode.appendChild(portalContainer);
};

export const removeContainer = (id: string) => {
    const container = document.getElementById(id);
    if (container) {
        const parent = container.parentNode;
        if (parent) {
            parent.removeChild(container);
        }
    }
};
