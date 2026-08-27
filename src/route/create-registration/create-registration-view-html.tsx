import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { CreateRegistrationGetState } from "./create-registration-model";

export function renderCreateRegistrationGetViewHtml(
  state: CreateRegistrationGetState,
) {
  return renderToHtml(<CreateRegistrationGetViewHtml state={state} />, false);
}

function CreateRegistrationGetViewHtml({
  state,
}: {
  state: CreateRegistrationGetState;
}) {
  return (
    <Layout language="cs" title="Vložení registračního záznamu">
      <header class="gov-header">
        <HeaderBranding state={state.branding} />
        <HeaderNavigation state={state.navigation} />
      </header>
      <gov-container>
        <h2>Vložení nového registračního záznamu</h2>
        <p>
          Zde můžete vkládat registrační záznamy do NKOD místo jejich zasílání
          přes datovou schránku. Zbytek funkcionality pro správu záznamů zůstává
          stejný. Změny se projeví v NKOD po jeho pravidelném zpracování, které
          typicky probíhá v nočních hodinách.
        </p>
        <br />
        <gov-grid gap="l" class="gov-card-grid">
          <gov-grid-item col-span="12" col-span-md="6">
            <gov-tile href={state.datasetRegistrationUrl}>
              <h3 slot="title">Registrace nové datové sady formulářem</h3>
              <p>
                Otevře formulář pro vyplnění záznamu pro registraci nové datové
                sady. Po jeho dokončení je záznam zaevidován.
              </p>
            </gov-tile>
          </gov-grid-item>
          <gov-grid-item col-span="12" col-span-md="6">
            <gov-tile href={state.catalogRegistrationUrl}>
              <h3 slot="title">
                Registrace nového lokálního katalogu formulářem
              </h3>
              <p>
                Otevře formulář pro vyplnění záznamu pro registraci nového
                lokálního katalogu. Po jeho dokončení je záznam zaevidován.
              </p>
            </gov-tile>
          </gov-grid-item>
        </gov-grid>
        <br />
        <section>
          <div>
            <h3>Registrační záznam ze souboru</h3>
            <div>
              <p>
                Záznamy lze vkládat i ze souborů. Soubory získáte vyplněním
                příslušných formulářů NKOD pro editaci či smazání datové sady či
                katalogu. Lze použít i pro nahrání ručně připravených záznamů
                pro novou datovou sadu či katalog.
              </p>
              <br />
              <form
                method="post"
                action={state.registrationUploadUrl}
                enctype="multipart/form-data"
              >
                <gov-form-control>
                  <gov-form-label slot="top">
                    Nahrát registrační záznam
                  </gov-form-label>
                  <gov-form-group>
                    <gov-form-file
                      accept=".txt,.jsonld,.json"
                      name="file"
                      max-file-size="262144"
                      required
                      expanded
                    >
                      <span>Přetáhněte soubor nebo</span>
                      <p>
                        <gov-button color="primary" size="m" type="outlined">
                          Nahrát ze zařízení
                        </gov-button>
                      </p>
                      <span class="gov-form-file__note">
                        Podporovaný formát JSON-LD
                      </span>
                    </gov-form-file>
                  </gov-form-group>
                </gov-form-control>
                <br />
                <gov-flex justify-content="flex-end">
                  <gov-button
                    color="primary"
                    type="outlined"
                    native-type="submit"
                  >
                    Vložit záznam
                  </gov-button>
                </gov-flex>
              </form>
            </div>
          </div>
        </section>
      </gov-container>
    </Layout>
  );
}
