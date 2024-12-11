import compose from "compose-function";

import { withConfirmationProvider } from "./withConfirmationProvider";
import { withPINCreationProvider } from "./withPINCreationProvider";
import { withQuery } from "./withQuery";
import { withRouter } from "./withRouter";
import { withStore } from "./withStore";
import { withToaster } from "./withToaster";

export const withProviders = compose(
    withRouter,
    withToaster,
    withStore,
    withQuery,
    withConfirmationProvider,
    withPINCreationProvider
);
