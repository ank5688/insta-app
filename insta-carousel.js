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
    this.images = [];
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
        height: 550px;
      }
      :host(:hover) {
        box-shadow: var(--playlist-project-box-shadow-hover, 0 4px 8px rgba(0,0,0,0.45));
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }
      h span {
        font-size: var(--playlist-project-label-font-size-xxlg, var(--ddd-font-size-xxlg));
      }
      .content {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }
      .bottom-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--ddd-spacing-2);
        margin-top: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-8);
      }
      button {
        background-color: rgba(255,255,255,0.8);
        color: var(--ddd-theme-default-beaverBlue);
        border: 1px solid var(--ddd-theme-default-beaverBlue);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      button:hover {
        background-color: white;
      }
      button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    
      slide-indicator {
        margin-bottom: var(--ddd-spacing-1);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3><span>${this.t.title}</span> ${this.title}</h3>
  <div class="content">
    <slot></slot>
  </div>
  <div class="bottom-controls">
    <button class="prev" ?disabled="${this.currentIndex === 0}" @click=${this.prev}>&lt;</button>
    <insta-indicators
      @playlist-index-changed=${this.handleEvent}
      .total=${this.slides ? this.slides.length : 0}
      .currentIndex=${this.currentIndex}>
    </insta-indicators>
    <button class="next" ?disabled="${this.currentIndex === this.slides.length - 1}" @click=${this.next}>&gt;</button>
  </div>
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

    // fetch images
    this.fetchImages();
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

    // assign images if available
    this._assignImages();
  }

  _assignImages() {
    this.slides.forEach((slide, i) => {
      if (this.images[i]) {
        slide.src = this.images[i];
        slide.alt = `Fox image ${i + 1}`;
      }

    });
  }

  async fetchImages() {
    const promises = [];
    for (let i = 0; i < 15; i++) {
      promises.push(
        fetch("https://randomfox.ca/floof/")
          .then((resp) => {
            if (resp.ok) {
              return resp.json();
            }
            return null;
          })
          .then((data) => data ? data.image : null)
      );
    }
    const urls = await Promise.all(promises);
    this.images = urls.filter(url => url !== null);
    this._assignImages();
  }

  updated(changed) {
    if (changed.has('index')) {
      this.currentIndex = this.index || 0;
      this._updateSlides();
    }
  }
}

globalThis.customElements.define(InstaApp.tag, InstaApp);