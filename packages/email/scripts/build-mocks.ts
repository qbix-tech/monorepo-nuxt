/* eslint-disable no-console */
import {
  renderEmail,
  type Templates,
  type TemplateName,
  type ExtractComponentProps,
} from "../src";
import mockConfig from "../mock.config";
import fs from "node:fs";

// running in vite-node
// @see https://github.com/vue-email/vue-email/issues/208

const BUILD_DIR = "dist/preview" as const;

const getPropData = <T extends TemplateName>(
  templateName: TemplateName,
): ExtractComponentProps<Templates[T]> => {
  return <ExtractComponentProps<Templates[T]>>mockConfig[templateName];
};

const main = async () => {
  const hasDir = fs.existsSync(BUILD_DIR);
  if (!hasDir) {
    await fs.promises.mkdir(BUILD_DIR, { recursive: true });
  }

  const { templates } = await import("../src");

  await Promise.all(
    (Object.keys(templates) as Array<keyof Templates>).map(
      async (templateName) => {
        const { html, text } = await renderEmail(
          templates[templateName],
          getPropData(templateName),
        );

        await Promise.all([
          fs.promises.writeFile(`${BUILD_DIR}/${templateName}.html`, html),
          fs.promises.writeFile(`${BUILD_DIR}/${templateName}.txt`, text),
        ]);
      },
    ),
  );
};

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
