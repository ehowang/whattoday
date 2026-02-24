import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
export const generateShortCode = customAlphabet(alphabet, 6);
