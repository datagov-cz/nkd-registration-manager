import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { RegistrationType } from "../../registration";
import {
  MessageItem,
  PaginationState,
  RegistrationListGetState,
} from "./registration-list-model";

export function renderRegistrationListGetViewHtml(
  state: RegistrationListGetState,
) {
  return renderToHtml(<RegistrationListGetViewHtml state={state} />);
}

function RegistrationListGetViewHtml({
  state,
}: {
  state: RegistrationListGetState;
}) {
  return (
    <Layout language="cs" title="Přehled registrací">
      <header class="gov-header">
        <HeaderBranding state={state.branding} />
        <HeaderNavigation state={state.navigation} />
      </header>
      <gov-container>
        <h2>Přehled registračních záznamů</h2>
        {state.messages.length === 0 && state.pagination.currentPage === 1 ? (
          <EmptyRegistrationList state={state} />
        ) : (
          <section aria-label="Výpis registrovaných záznamů">
            <gov-flex direction="column" gap="xl" response="true">
              <RegistrationList messages={state.messages} />
              <Pagination pagination={state.pagination} />
            </gov-flex>
          </section>
        )}
      </gov-container>
    </Layout>
  );
}

function EmptyRegistrationList({ state }: { state: RegistrationListGetState }) {
  return (
    <gov-empty align="left" size="m">
      <gov-icon type="colored" name="empty-file" slot="icon"></gov-icon>
      <p slot="headline">
        Pro vaší organizaci nejsou k dispozici žádné registrační zprávy.
      </p>
      <p>
        Registrační záznam můžete přidat přes
        <gov-button type="link" href={state.createRegistrationUrl}>
          vložení registračního záznamu
        </gov-button>
        .
      </p>
    </gov-empty>
  );
}

function RegistrationList({ messages }: { messages: MessageItem[] }) {
  return (
    <gov-grid gap="l" className="gov-card-grid" role="list">
      {messages.map((item, index) => (
        <gov-grid-item col-span="12" role="listitem">
          <article>
            <gov-card direction="horizontal" aria-labelledby={"card-" + index}>
              <gov-flex justify-content="space-between" align-items="center">
                <gov-flex gap="s" direction="column">
                  <header>
                    <h3 id={"card-" + index} class="gov-card__headline">
                      <RegistrationItemTitle item={item} />
                    </h3>
                  </header>
                  <gov-flex gap="s" align-items="center" responsive="false">
                    <gov-icon
                      type="complex"
                      name="time"
                      color="default"
                      size="m"
                      aria-label="Datum vytvoření záznamu"
                    ></gov-icon>
                    <Time value={item.createdAt} />
                  </gov-flex>
                </gov-flex>
                <a href={item.detailUrl} title="Zobrazit detail záznamu">
                  <gov-icon name="file-earmark" size="2xl"></gov-icon>
                </a>
              </gov-flex>
            </gov-card>
          </article>
        </gov-grid-item>
      ))}
    </gov-grid>
  );
}

function RegistrationItemTitle({ item }: { item: MessageItem }) {
  if (item.type === RegistrationType.WithdrawCatalog) {
    if (item.withdrawUrl === null) {
      return "Smazání registrace katalogu";
    } else {
      return `Smazání registrace katalogu ${item.withdrawUrl}`;
    }
  }
  if (item.type === RegistrationType.WithdrawDataset) {
    if (item.withdrawUrl === null) {
      return "Smazání registrace datové sady";
    } else {
      return `Smazání registrace datové sady ${item.withdrawUrl}`;
    }
  }
  return item.label;
}

function Time({ value }: { value: Date }) {
  return (
    <time datetime={value.toISOString()}>
      {value.toLocaleString("cs-CZ", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Prague",
      })}
    </time>
  );
}

function Pagination({ pagination }: { pagination: PaginationState }) {
  if (pagination.totalRecords < pagination.pageSize) {
    return null;
  }
  return (
    <gov-flex justify-content="center">
      <gov-pagination
        total={String(pagination.totalRecords)}
        current={String(pagination.currentPage)}
        page-size={pagination.pageSize}
        link="?str%C3%A1nka&#x3D;{PAGE}"
      />
    </gov-flex>
  );
}
