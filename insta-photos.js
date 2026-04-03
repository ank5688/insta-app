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
    this.thumbnail = "";
    this.fullsize = "";
    this.currentIndex = 0;
    this.alt = "";
    this.description = "";
    this.authorPhoto = "";
    this.authorSince = "";
    this.authorChannel = "";
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
      thumbnail: { type: String },
      fullsize: { type: String },
      currentIndex: { type: Number },
      alt: { type: String },
      description: { type: String },
      authorPhoto: { type: String },
      authorSince: { type: String },
      authorChannel: { type: String },
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
        padding: var(--ddd-spacing-2) var(--ddd-spacing-6) var(--ddd-spacing-4) var(--ddd-spacing-6);
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
        margin: var(--ddd-spacing-0);
        text-transform: uppercase;
        font-weight: var(--ddd-font-weight-bold);
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
        border-radius: var(--ddd-radius-sm);
        border: var(--ddd-border-md) solid transparent;
      }
      @media (prefers-color-scheme: dark) {
        :host {
          color: #001f3f;
          background-color: #f8f9fa;
        }
        .image-description,
        h2,
        p {
          color: #001f3f;
        }
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="slide-content">
   ${this.topHeading ? html`<h2><img src="${this.authorPhoto}" alt="User icon" style="width: 50px; height: 50px; margin-right: 5px; margin-top: -7px; vertical-align: middle;">${this.topHeading}</h2>` : ""}
  ${this.authorChannel || this.authorSince ? html`<p style="font-size:.8rem; margin: 0; color: var(--ddd-theme-default-slateGray);">${this.authorChannel ? `${this.authorChannel}` : ''}${this.authorChannel && this.authorSince ? ' · ' : ''}${this.authorSince ? `User since ${this.authorSince}` : ''}</p>` : ''}
  ${this.active ? html`${(this.src || this.fullsize || this.thumbnail) ? html`<img src="${this.src || this.fullsize || this.thumbnail}" alt="${this.alt || 'Slide image'}" style="max-width: 100%; max-height: 80%; object-fit: contain; margin-bottom: var(--ddd-spacing-1);" />` : html`<p>No image source available</p>`}` : ""}
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