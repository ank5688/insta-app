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
    this.thumbnails = [];
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      total: { type: Number },
      currentIndex: { type: Number },
      thumbnails: { type: Array }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
      display: block;
    }
    .thumbs {
      display: flex;
      justify-content: center;
      gap: var(--ddd-spacing-1);
      padding: var(--ddd-spacing-2);
      flex-wrap: wrap;
    }
    .thumb {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      opacity: 0.45;
      cursor: pointer;
      transition: opacity 0.2s, outline 0.2s;
      outline: 2px solid transparent;
    }
    .thumb.active {
      opacity: 1;
      outline: 2px solid var(--ddd-theme-default-beaverBlue);
    }
    .thumb:hover {
      opacity: 0.8;
    }
    `];
  }

 render() {
  const items = [];
  for (let i = 0; i < this.total; i++) {
    const src = this.thumbnails[i] || '';
    items.push(html`
      <img
        class="thumb ${i === this.currentIndex ? 'active' : ''}"
        src="${src}"
        alt="Go to image ${i + 1}"
        data-index="${i}"
        @click="${this._handleThumbClick}"
      />
    `);
  }
  return html`<div class="thumbs">${items}</div>`;
}
  _handleThumbClick(e) {
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