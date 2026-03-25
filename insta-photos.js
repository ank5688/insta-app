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
    this.src = "";
    this.alt = "";
    this.description = "";
    this.authorPhoto = "";
    this.liked = false;
    this.imageId = null;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      active: { type: Boolean, reflect: true },
      topHeading: { type: String },
      secondHeading: { type: String },
      src: { type: String },
      alt: { type: String },
      description: { type: String },
      authorPhoto: { type: String },
      liked: { type: Boolean },
      imageId: { type: Number }
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
        height: 100%;
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
      .image-description {
        margin: 0 0 var(--ddd-spacing-2) 0;
        margin-left: 5px;
        font-size: var(--ddd-font-size-sm);
        color: var(--ddd-theme-default-slateGray);
      }
      .description-with-heart {
        display: flex;
        align-items: flex-start;
        gap: var(--ddd-spacing-1);
        margin: 0 0 var(--ddd-spacing-2) 0;
      }
      .heart-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        flex-shrink: 0;
        margin-top: -4px;
        margin-left: 70px;
      }
      .heart-button img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        object-position: center;
      }
      .heart-button:hover {
        opacity: 0.7;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="slide-content">
  ${this.topHeading ? html`<h2><img src="${this.authorPhoto}" alt="User icon" style="width: 50px; height: 50px; margin-right: 5px; margin-top: -7px; vertical-align: middle;">${this.topHeading}</h2>` : ""}
  ${this.active && this.src ? html`<img src="${this.src}" alt="${this.alt || this.secondHeading || 'Slide image'}" loading="lazy" style="max-width: 100%; max-height: 80%; object-fit: contain; margin-bottom: var(--ddd-spacing-2);" />` : ""}
  ${this.description ? html`
    <div class="description-with-heart">
      <button class="heart-button" @click="${this._toggleLike}" title="Like this photo">
        <img src="${this.liked ? 'like-icon.png' : 'unlike-icon.png'}" alt="${this.liked ? 'Unlike' : 'Like'}" />
      </button>
      <p class="image-description">${this.description}</p>
    </div>
  ` : ""}
  <div class="body">
    <slot></slot>
  </div>
</div>`;
  }

  _toggleLike() {
    this.liked = !this.liked;
    this.dispatchEvent(new CustomEvent('like-toggled', {
      detail: { imageId: this.imageId, liked: this.liked },
      bubbles: true,
      composed: true
    }));
  }
}

globalThis.customElements.define(InstaPhotos.tag, InstaPhotos);