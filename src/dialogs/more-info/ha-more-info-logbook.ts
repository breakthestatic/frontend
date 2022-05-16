import { startOfYesterday } from "date-fns";
import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { isComponentLoaded } from "../../common/config/is_component_loaded";
import { fireEvent } from "../../common/dom/fire_event";
import "../../panels/logbook/ha-logbook";
import type { HomeAssistant } from "../../types";

@customElement("ha-more-info-logbook")
export class MoreInfoLogbook extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public entityId!: string;

  private _showMoreHref = "";

  private _time = { recent: 86400 };

  protected render(): TemplateResult {
    if (!isComponentLoaded(this.hass, "logbook") || !this.entityId) {
      return html``;
    }
    const stateObj = this.hass.states[this.entityId];

    if (!stateObj) {
      return html``;
    }

    return html`
      <div class="header">
        <div class="title">
          ${this.hass.localize("ui.dialogs.more_info_control.logbook")}
        </div>
        <a href=${this._showMoreHref} @click=${this._close}
          >${this.hass.localize("ui.dialogs.more_info_control.show_more")}</a
        >
      </div>
      <ha-logbook
        .hass=${this.hass}
        .time=${this._time}
        .entityId=${this.entityId}
        narrow
        no-icon
        no-name
        relative-time
      ></ha-logbook>
    `;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("entityId") && this.entityId) {
      this._showMoreHref = `/logbook?entity_id=${
        this.entityId
      }&start_date=${startOfYesterday().toISOString()}`;
    }
  }

  private _close(): void {
    setTimeout(() => fireEvent(this, "closed"), 500);
  }

  static get styles() {
    return [
      css`
        ha-logbook {
          --logbook-max-height: 250px;
        }
        @media all and (max-width: 450px), all and (max-height: 500px) {
          ha-logbook {
            --logbook-max-height: unset;
          }
        }
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .header > a,
        a:visited {
          color: var(--primary-color);
        }
        .title {
          font-family: var(--paper-font-title_-_font-family);
          -webkit-font-smoothing: var(
            --paper-font-title_-_-webkit-font-smoothing
          );
          font-size: var(--paper-font-subhead_-_font-size);
          font-weight: var(--paper-font-title_-_font-weight);
          letter-spacing: var(--paper-font-title_-_letter-spacing);
          line-height: var(--paper-font-title_-_line-height);
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-more-info-logbook": MoreInfoLogbook;
  }
}
