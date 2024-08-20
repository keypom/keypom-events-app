import { Buffer } from "buffer";

window.Buffer = Buffer;
window.process = {
  env: {},
  version: "",
  nextTick: (cb) => setTimeout(cb, 0),
};
