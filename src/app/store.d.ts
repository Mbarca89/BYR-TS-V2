declare const userState: import("recoil").RecoilState<{
    id: number;
    name: string;
    surname: string;
    userName: string;
    role: string;
}>;
declare const logState: import("recoil").RecoilState<boolean>;
declare const modalState: import("recoil").RecoilState<boolean>;
export { userState, logState, modalState };
