export const allowedFormats = {
  mp4: {
    videoCodec: "libx264",
    audioCodec: "aac",
    contentType: "video/mp4"
  },
  webm: {
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
    contentType: "video/webm"
  },
  mkv: {
    videoCodec: "libx264",
    audioCodec: "aac",
    contentType: "video/x-matroska"
  },
  avi: {
    videoCodec: "mpeg4",
    audioCodec: "mp3",
    contentType: "video/x-msvideo"
  }
};