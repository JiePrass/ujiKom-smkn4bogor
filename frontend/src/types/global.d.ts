declare global {
    interface Window {
        snap: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pay: (token: string, options?: any) => void;
        };
    }
}
export { };
