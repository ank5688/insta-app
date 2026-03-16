/**
 * Copyright 2026 Amelia Karamanos
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


/**
 * `insta-photos`
 * 
 * individual slide for playlist-project
 * supports two headings and flexible/scrollable body
 *
 * @demo index.html
 * @element insta-photos
 */
export class InstaPhotos extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "insta-photos";
  }

  constructor() {
    super();
    this.active = false;
    this.topHeading = "";
    this.secondHeading = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      active: { type: Boolean, reflect: true },
      topHeading: { type: String },
      secondHeading: { type: String }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: none;
        box-sizing: border-box;
        width: 100%;
        height: var(--playlist-slide-height, 300px);
        max-height: var(--playlist-slide-height, 3000px);
        color: var(--playlist-project-text-color, #001f3f);
        padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
      }
      :host([active]) {
        display: block;
      }
      .slide-content {
        display: flex;
        flex-direction: column;
        height: 95%;
      }
      h2 {
        font-size: var(--playlist-slide-heading-top-font-size, var(--ddd-font-size-lg));
        margin: 0;
        text-transform: uppercase;
        font-weight: var(--playlist-slide-heading-top-font-weight, normal);
        color: var(--playlist-slide-heading-color, var(--ddd-theme-default-beaverBlue));
        letter-spacing: 0.02em;
      }
      h3 {
        font-size: var(--playlist-slide-heading-second-font-size, var(--ddd-font-size-xxxlg));
        margin: var(--ddd-spacing-2) 0;
      }
      .body {
        flex: 1;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      .body ::slotted(p) {
        margin: 0;
        max-height: 100%;
      }
      .body::-webkit-scrollbar {
        width: 12px;
      }
      .body::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.05);
      }
      .body::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.2);
        border-radius: 6px;
        border: 3px solid rgba(0,0,0,0.05);
      }
      .line {
        border-top: 1px solid var(--ddd-theme-default-beaverBlue);
        font-size: 10px;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="slide-content">
  ${this.topHeading ? html`<h2>${this.topHeading}</h2>` : ""}
  ${this.secondHeading ? html`<h3>${this.secondHeading}</h3>` : ""}
  <div class="line">⎯⎯</div>
  <div class="body">
    <slot></slot>
  </div>
</div>`;
}
}

globalThis.customElements.define(InstaPhotos.tag, InstaPhotos);