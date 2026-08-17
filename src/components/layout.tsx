import { VNode } from "preact";
import { configuration } from "../application/configuration";

export function Layout(props: {
  children: VNode<any> | VNode<any>[];
  language: string;
  title: string;
}) {
  const designSystem = configuration.govDesignSystem.url;
  const govDsConfig = {
    canValidateWcagOnRender: true,
    iconsPath: `${designSystem}assets/icons`,
  };
  return (
    <html lang={props.language}>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{props.title}</title>
        <link
          rel="stylesheet"
          href={`${designSystem}assets/styles/critical.css`}
        />
        <link
          rel="stylesheet"
          href={`${designSystem}assets/fonts/roboto.css`}
        />
        <link
          rel="stylesheet"
          href={`${designSystem}assets/components/core/core.css`}
        />
        <link rel="stylesheet" href="./assets/css/style.css" />
        {/* We need to render the content as JavaScript which is not safe. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.GOV_DS_CONFIG = ${JSON.stringify(govDsConfig)};`,
          }}
        />
        <script
          type="module"
          src={`${designSystem}assets/components/core/core.esm.js`}
        />
        <script
          nomodule={true}
          src={`${designSystem}assets/components/core/core.js`}
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
