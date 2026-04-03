/**
 * Copyright 2026 Amelia Karamanos
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


/**
 * `slide-arrow`
 *
 * simple left/right control for playlist-project
 *
 * @demo index.html
 * @element insta-arrows
 */
export class InstaArrows extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "insta-arrows";
  }

  constructor() {
    super();
    this.index = 0;
  }


  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      index: { type: Number },
      total: { type: Number },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        position: absolute;
        top: 50%;
        left: var(--ddd-spacing-0);
        width: 100%;
        transform: translateY(-50%);
        pointer-events: none;
        overflow: visible;
      }
      .wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        pointer-events: auto;
      }
      button {
        background-color: var(---ddd-theme-default-white);
        color: var(--ddd-theme-default-beaverBlue);
        border: 1px solid var(--ddd-theme-default-beaverBlue);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: var(--playlist-arrow-icon-size, 1.25rem);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      button:hover {
        background-color: white;
      }
      button.prev {
        left: -30px;
      }
      button.next {
        right: -30px;
      }
      button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      <button class="prev"
        ?disabled="${this.index === 0}"
        @click=${() => this.dispatchEvent(new CustomEvent('prev-clicked', {bubbles: true, composed: true}))}
        aria-label="Previous image">
        &lt;
      </button>
      <button class="next"
        ?disabled="${this.index === this.total - 1}"
        @click=${() => this.dispatchEvent(new CustomEvent('next-clicked', {bubbles: true, composed: true}))}
        aria-label="Next image">
       &gt;
      </button>
    </div>
`;
  }
}

globalThis.customElements.define(InstaArrows.tag, InstaArrows);