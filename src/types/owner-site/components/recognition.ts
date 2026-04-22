export interface RecognitionTemplate1Data {
  template: "recognition-1";
  eyebrow: string;
  title: string;
  buttonText: string;
  buttonHref: string;
  collectionSlug?: string;
}

export type RecognitionData = RecognitionTemplate1Data;

export const DEFAULT_RECOGNITION_MAP: Record<
  RecognitionData["template"],
  RecognitionData
> = {
  "recognition-1": {
    template: "recognition-1",
    eyebrow: "Recognition",
    title: "A few nice things.",
    buttonText: "Get in touch",
    buttonHref: "/contact",
    collectionSlug: "recognition",
  },
};

export const isRecognitionTemplate1 = (
  data: RecognitionData
): data is RecognitionTemplate1Data => data.template === "recognition-1";
