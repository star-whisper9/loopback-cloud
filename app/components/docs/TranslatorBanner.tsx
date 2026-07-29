import type { DocTranslator } from "~/lib/docs/types";
import { useT } from "~/i18n/useT";

export function TranslatorBanner({
  translator,
}: {
  translator: DocTranslator;
}) {
  const t = useT();
  const params: Record<string, string> = {};
  if (translator.model) params.model = translator.model;
  if (translator.human && translator.human.length > 0) {
    params.translators = translator.human.join(", ");
  }

  let text: string;
  switch (translator.type) {
    case "machine":
      text = t("docs.translatorMachine", params);
      break;
    case "llm":
      text = t("docs.translatorLlm", params);
      break;
    case "human":
      text = t("docs.translatorHuman", params);
      break;
    case "mix":
      text = t("docs.translatorMix", params);
      break;
    default:
      throw new Error(`TODO: unhandled translator type ${(translator as DocTranslator).type}`);
  }

  return (
    <div className={`docs-translator-banner docs-translator-banner--${translator.type}`}>
      {text}
    </div>
  );
}
