import { RouteService } from "../route";

/**
 * This is separated from header as we do not render it for every route.
 */
export function HeaderNavigation({ state }: { state: HeaderNavigationState }) {
  return (
    <div class="gov-header__navigation js-gov-header__navigation">
      <nav
        class="gov-navigation"
        aria-label="Hlavní navigace"
        id="main-navigation"
      >
        <ul>
          <li
            className={
              state.createRegistrationActive ? "navigation-item-active" : ""
            }
          >
            <a href={state.createRegistrationUrl}>
              Vložení registračního záznamu
            </a>
          </li>
          <li
            className={
              state.listRegistrationActive ? "navigation-item-active" : ""
            }
          >
            <a href={state.listRegistrationUrl}>
              Přehled registračních záznamů
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export interface HeaderNavigationState {
  listRegistrationUrl: string;

  createRegistrationActive?: boolean;

  createRegistrationUrl: string;

  listRegistrationActive?: boolean;
}

export function createHeaderNavigationState(
  route: RouteService,
): HeaderNavigationState {
  return {
    listRegistrationUrl: route.listRegistration(),
    createRegistrationUrl: route.createRegistration(),
  };
}
