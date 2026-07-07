import arcjet, { shield, detectBot } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_API_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "DRY_RUN",
    }),
    detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

export default aj;