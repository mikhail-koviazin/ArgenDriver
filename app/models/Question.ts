export type QuestionResponse = {
  text: {
    es: string;
    ru: string;
    en: string;
  }
  correct?: boolean;
}

export type Question = {
  num: number;
  text: {
    es: string;
    ru: string;
    en: string;
  }
  img?: string | null;
  responses: QuestionResponse[];
  explanation: {
    text: {
      es: string;
      ru: string;
      en: string;
    }
  }
  citation?: string;
};
