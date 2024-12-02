import { atom } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    id: 0,
    name: "",
    surname: "",
    userName: "",
    role: "user"
  }
})

const logState = atom({
  key: "logState",
  default: false
})

const modalState = atom({
  key: "modalState",
  default: false
})

export { userState, logState, modalState}