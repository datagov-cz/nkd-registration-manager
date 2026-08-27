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
        {/* Design system. */}
        {/* We need to render the content as JavaScript which is not safe. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.GOV_DS_CONFIG = ${JSON.stringify(govDsConfig)};`,
          }}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/tokens.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/styles.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/layout.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/components.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/animations.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/content.css"}
        />
        <link
          rel="stylesheet"
          href={designSystem + "/assets/styles/templates.css"}
        />
        <script
          type="module"
          src={designSystem + "/assets/components/core/core.esm.js"}
        ></script>
        {/* Custom styles. */}
        <link rel="stylesheet" href="./assets/css/style.css" />
      </head>
      <body>
        <div class="gov-story-theme-scope">{props.children}</div>
      </body>
    </html>
  );
}
