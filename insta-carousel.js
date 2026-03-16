/**
 * Copyright 2026 Amelia Karamanos
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// bring in child components so they are registered when someone pulls in playlist-project
import "./insta-photos.js";
import "./insta-arrows.js";
import "./insta-indicators.js";


/**
 * `insta-carousel`
 * 
 * @demo index.html
 * @element insta-app
 */
export class InstaApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "insta-carousel";
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
    this.index = 0;           // starting index via attribute
    this.currentIndex = 0;
    this.slides = [];
    this._updateSlides();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      topHeading: { type: String },
      secondHeading: { type: String },
      index: { type: Number, reflect: true },
      currentIndex: { type: Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--playlist-project-text-color, #001f3f);
        background-color: var(--ddd-theme-default-slateMaxLight);
        font-family: var(--ddd-font-navigation);
        box-shadow: var(--playlist-project-box-shadow, 0 2px 4px rgba(0,0,0,0.25));
      }
      :host(:hover) {
        box-shadow: var(--playlist-project-box-shadow-hover, 0 4px 8px rgba(0,0,0,0.45));
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        position: relative;
      }
      h span {
        font-size: var(--playlist-project-label-font-size-xxlg, var(--ddd-font-size-xxlg));
      }
      .arrow{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: -60px;
        margin-right: -60px;
      }
    
      slide-indicator {
        position: absolute;
        bottom: var(--ddd-spacing-1);
        left: var(--ddd-spacing-4);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3><span>${this.t.title}</span> ${this.title}</h3>
  <slot></slot>
  <div class="arrow">
    <insta-arrows
      .index=${this.currentIndex}
      .total=${this.slides ? this.slides.length : 0}
      @prev-clicked=${this.prev}
      @next-clicked=${this.next}>
    </insta-arrows>
  </div>
  <insta-indicators
    @playlist-index-changed=${this.handleEvent}
    .total=${this.slides ? this.slides.length : 0}
    .currentIndex=${this.currentIndex}>
  </insta-indicators>
  </div>`;
  }

  handleEvent(e) {
    this.currentIndex = e.detail.index;
    this._updateSlides();
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this._updateSlides();
    }

  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._updateSlides();
    }
  }

  firstUpdated() {
    // watch for slot content changes so we can refresh the slide list
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => {
      this.slides = Array.from(this.querySelectorAll('insta-photos'));
      this._updateSlides();
    });

    // set the starting index from attribute
    this.currentIndex = this.index || 0;
    this._updateSlides();
  }

  _updateSlides() {
    // refresh slide list in case it has changed
    this.slides = Array.from(this.querySelectorAll('insta-photos'));

    // clamp currentIndex
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    if (this.slides.length && this.currentIndex > this.slides.length - 1) {
      this.currentIndex = this.slides.length - 1;
    }

    // update slide elements via their `active` property
    this.slides.forEach((slide, i) => {
      slide.active = i === this.currentIndex;
    });
  }

  updated(changed) {
    if (changed.has('index')) {
      this.currentIndex = this.index || 0;
      this._updateSlides();
    }
  }
}

globalThis.customElements.define(InstaApp.tag, InstaApp);