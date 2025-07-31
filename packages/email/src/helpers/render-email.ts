import { render } from "@vue-email/render";
import type { ExtractComponentProps } from "../types";
import type { Component } from "vue";

const renderEmail = async <T extends Component>(
  component: T,
  props?: ExtractComponentProps<T>,
) => {
  let html: string | undefined;
  let text: string | undefined;

  await Promise.allSettled([
    render(component, props).then((res) => {
      html = res;
    }),
    render(component, props, { plainText: true }).then((res) => {
      text = res;
    }),
  ]);

  if (typeof html === "undefined" || typeof text === "undefined") {
    throw new Error("Failed to render email");
  }

  return { html, text };
};

export default renderEmail;
