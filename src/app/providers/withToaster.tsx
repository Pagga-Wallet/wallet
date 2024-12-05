/* eslint-disable boundaries/element-types */
// import { Suspense } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import s from "../styles/toaster.module.scss";

export const withToaster = (component: () => React.ReactNode) => () =>
    (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                closeButton={false}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                icon={false}
                className={s.toaster}
                rtl={false}
                draggable
                pauseOnHover
                theme="dark"
            />
            {component()}
        </>
    );
