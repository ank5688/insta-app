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
    this.visibleThumbnails = new Set();
    this._updateVisibleThumbnails();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      total: { type: Number },
      currentIndex: { type: Number },
      thumbnails: { type: Array },
      visibleThumbnails: { type: Object }
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
      gap: var(--ddd-spacing-1);
      padding: var(--ddd-spacing-2);
      overflow-x: auto;
      width: 320px;
      scrollbar-width: thin;
      scrollbar-color: rgba(0,0,0,0.2) transparent;
    }
    .thumbs::-webkit-scrollbar {
      height: 4px;
    }
    .thumbs::-webkit-scrollbar-track {
      background: transparent;
    }
    .thumbs::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.2);
      border-radius: 2px;
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
    .track {
      display: flex;
      gap: var(--ddd-spacing-3);
      align-items: center;
      width: max-content;
    }
    `];
  }

 render() {
  const items = [];
  for (let i = 0; i < this.total; i++) {
    const isVisible = this.visibleThumbnails.has(i);
    const src = isVisible ? (this.thumbnails[i] || '') : '';
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
  firstUpdated() {
    super.firstUpdated();
    const thumbsContainer = this.shadowRoot.querySelector('.thumbs');
    if (thumbsContainer) {
      thumbsContainer.addEventListener('scroll', this._handleScroll.bind(this));
      this._updateVisibleThumbnails();
    }
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('currentIndex') || changed.has('total')) {
      this._updateVisibleThumbnails();
    }
  }

  _updateVisibleThumbnails() {
    const thumbsContainer = this.shadowRoot?.querySelector('.thumbs');
    if (!thumbsContainer) return;

    const containerWidth = thumbsContainer.clientWidth;
    const scrollLeft = thumbsContainer.scrollLeft;
    const thumbWidth = 40 + 4; // thumb width + gap
    const visibleStart = Math.floor(scrollLeft / thumbWidth);
    const visibleEnd = Math.ceil((scrollLeft + containerWidth) / thumbWidth);
    
    // Include some buffer thumbnails around the visible area and current index
    const buffer = 2;
    const newVisible = new Set();
    
    for (let i = Math.max(0, visibleStart - buffer); i < Math.min(this.total, visibleEnd + buffer); i++) {
      newVisible.add(i);
    }
    
    // Always include thumbnails around the current index
    for (let i = Math.max(0, this.currentIndex - buffer); i < Math.min(this.total, this.currentIndex + buffer + 1); i++) {
      newVisible.add(i);
    }
    
    this.visibleThumbnails = newVisible;
    this.requestUpdate();
  }

  _handleScroll() {
    this._updateVisibleThumbnails();
  }

  scrollToIndex(index) {
    const thumbsContainer = this.shadowRoot.querySelector('.thumbs');
    if (!thumbsContainer) return;
    
    const thumbElements = thumbsContainer.querySelectorAll('.thumb');
    const thumbElement = thumbElements[index];
    if (!thumbElement) return;
    
    // Scroll to center the thumbnail
    const containerWidth = thumbsContainer.clientWidth;
    const thumbWidth = thumbElement.offsetWidth;
    const thumbLeft = thumbElement.offsetLeft;
    const scrollLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
    
    thumbsContainer.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }

  _handleThumbClick(e) {
    const index = parseInt(e.target.dataset.index);
    this.scrollToIndex(index);
    
    const indexChange = new CustomEvent("playlist-index-changed", {
      composed: true,
      bubbles: true,
      detail: {
        index: index
      }
    });
    this.dispatchEvent(indexChange);
  }
  
}

globalThis.customElements.define(InstaIndicators.tag, InstaIndicators);