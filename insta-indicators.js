/**
 * Copyright 2026 Amelia Karamanos
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


/**
 * `playlist-project`
 * 
 * @demo index.html
 * @element insta-indicators
 */
export class InstaIndicators extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "insta-indicators";
  }

  constructor() {
    super();
    this.total = 0;
    this.currentIndex = 0;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      total: { type: Number },
      currentIndex: { type: Number },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
      }
      .dots {
        display: flex;
        justify-content: center;
        gap: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-2);
      }
      .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: var(--ddd-theme-default-beaverBlue);
        opacity: 0.4;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .dot.active {
        opacity: 1;
      }
    `];
  }

  // Lit render the HTML
  render() {
    let dots = [];
    for (let i = 0; i < this.total; i++) {
      dots.push(html`
        <span @click="${this._handleDotClick}" data-index="${i}" class="dot ${i === this.currentIndex ? 'active' : ''}"></span>
      `);
    }
    return html`
    <div class="dots">
      ${dots}
    </div>`;
  }
  _handleDotClick(e) {
    const indexChange = new CustomEvent("playlist-index-changed", {
      composed: true,
      bubbles: true,
      detail: {
        index: parseInt(e.target.dataset.index)
      }
    });
    this.dispatchEvent(indexChange);
  }
  
}

globalThis.customElements.define(InstaIndicators.tag, InstaIndicators);