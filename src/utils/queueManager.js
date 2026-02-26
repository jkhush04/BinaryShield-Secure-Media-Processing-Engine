import pLimit from "p-limit";

export const imageQueue = pLimit(3);
export const videoQueue = pLimit(1);
export const audioQueue = pLimit(2);
export const pdfQueue = pLimit(1);