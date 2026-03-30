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
    this.images = []; // initialize as array
    this.authors = []; // initialize as array
    this.thumbnails = []; // initialize thumbnails array
    this.currentDescription = "";
    this.currentLiked = false;
    this.currentImageId = null;
    this._updateSlides();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      topHeading: { type: String },
      secondHeading: { type: String },
      index: { type: Number, reflect: true },
      currentIndex: { type: Number },
      thumbnails: { type: Array },
      currentDescription: { type: String },
      currentLiked: { type: Boolean },
      currentImageId: { type: Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--playlist-project-text-color, #001f3f);
        background-color: #f8f9fa;
        font-family: var(--ddd-font-navigation);
        box-shadow: 0 4px 8px rgba(0,0,0,0.30);
        border: 2px solid #ccc;
        border-radius: 12px;
        height: 550px;
        width: 100%;
        max-width: 400px;
        margin: 0;
      }
      .wrapper {
        margin: var(--ddd-spacing-0);
        padding: var(--ddd-spacing-2);
        position: relative;
        display: flex;
        flex-direction: column;
        height: 550px;
        min-height: 0;
      }
      h span {
        font-size: var(--playlist-project-label-font-size-xxlg, var(--ddd-font-size-xxlg));
      }
      .content {
        flex: 1;
        min-height: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bottom-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 var(--ddd-spacing-2);
        margin-top: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-8);
      }
      .indicators-container {
        margin-bottom: var(--ddd-spacing-1);
      }
      .description-with-heart {
        display: flex;
        align-items: flex-start;
        gap: var(--ddd-spacing-1);
        margin: 0 0 var(--ddd-spacing-1) 0;
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
        margin-left: -80px;
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
      .image-description {
        margin: 0 0 var(--ddd-spacing-2) 0;
        margin-left: 5px;
        font-size: var(--ddd-font-size-sm);
        color: var(--ddd-theme-default-slateGray);
      }
      .arrow-btn {
        position: absolute;
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
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
      }
      .arrow-btn:hover {
        background-color: white;
      }
      .arrow-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .prev-btn {
        left: var(--ddd-spacing-2);
      }
      .next-btn {
        right: var(--ddd-spacing-2);
      }
    
      slide-indicator {
        margin-bottom: var(--ddd-spacing-1);
        margin-bottom: var(--ddd-spacing-2); --- IGNORE ---
      }
      @media (max-width: 600px) {
        :host {
          height: 450px;
          max-width: 100%;
          margin: var(--ddd-spacing-2);
        }
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3>
    <span>${this.t.title}</span> ${this.title}
  </h3>
  <div class="content">
    <button class="arrow-btn prev-btn" ?disabled="${this.currentIndex === 0}" @click=${this.prev}>&lt;</button>
    <slot></slot>
    <button class="arrow-btn next-btn" ?disabled="${this.currentIndex === this.slides.length - 1}" @click=${this.next}>&gt;</button>
  </div>
  <div class="bottom-controls">
    <div class="indicators-container">
      <insta-indicators
        @playlist-index-changed=${this.handleEvent}
        .total=${this.slides ? this.slides.length : 0}
        .currentIndex=${this.currentIndex}
        .thumbnails=${this.thumbnails}>
      </insta-indicators>
    </div>
    ${this.currentDescription ? html`
      <div class="description-with-heart">
        <button class="heart-button" @click="${this._toggleCurrentLike}" title="Like this photo">
          <img src="${this.currentLiked ? 'like-icon.png' : 'unlike-icon.png'}" alt="${this.currentLiked ? 'Unlike' : 'Like'}" />
        </button>
        <p class="image-description">${this.currentDescription}</p>
      </div>
    ` : ""}
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
      this._attachLikeListeners();
    });

    // set the starting index from attribute
    this.loadData();
  }

  _attachLikeListeners() {
    this.slides.forEach(slide => {
      slide.removeEventListener('like-toggled', this._handleLikeToggle);
      slide.addEventListener('like-toggled', this._handleLikeToggle.bind(this));
    });
  }

  _handleLikeToggle(e) {
    const { imageId, liked } = e.detail;
    // Save to localStorage
    const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
    likedImages[imageId] = liked;
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
    
    // Update current liked status if this is the current image
    if (imageId === this.currentImageId) {
      this.currentLiked = liked;
    }
  }

  _toggleCurrentLike() {
    this.currentLiked = !this.currentLiked;
    // Update the image data
    if (this.images[this.currentIndex]) {
      this.images[this.currentIndex].liked = this.currentLiked;
    }
    // Trigger the like toggle event
    this._handleLikeToggle({ detail: { imageId: this.currentImageId, liked: this.currentLiked } });
  }

  _updateSlides() {
    // refresh slide list in case it has changed
    this.slides = Array.from(this.querySelectorAll('insta-photos'));

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    if (this.slides.length && this.currentIndex > this.slides.length - 1) {
      this.currentIndex = this.slides.length - 1;
    }

    this.slides.forEach((slide, i) => {
      slide.active = i === this.currentIndex;
      slide.currentIndex = i;
    });

    // Update current image data for display below thumbnails
    if (this.images[this.currentIndex]) {
      const currentImage = this.images[this.currentIndex];
      this.currentDescription = currentImage.caption || '';
      this.currentLiked = currentImage.liked || false;
      this.currentImageId = currentImage.id;
    }

    this._assignImages();
  }

  async loadData() {
    try {
      const resp = await fetch('./data.json');
      const data = await resp.json();
      this.images = data.images || [];
      this.authors = data.authors || [];
      
      // Load liked state from localStorage
      const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
      this.images = this.images.map(image => ({
        ...image,
        liked: likedImages[image.id] !== undefined ? likedImages[image.id] : image.liked
      }));
      
      this.slides = Array.from(this.querySelectorAll('insta-photos'));

      this._readIndexFromURL();
      this._updateSlides();
      this._attachLikeListeners();
    } catch (error) {
      console.error('Failed to load data.json', error);
    }
  }

  _assignImages() {
    const base = new URL('./', import.meta.url).href;
    this.thumbnails = []; // reset thumbnails array
    this.slides.forEach((slide, i) => {
      if (this.images[i]) {
        const image = this.images[i];
        const author = this.authors.find(a => a.id === image.authorId) || {};
        
        slide.src = slide.active ? (base + (image.fullsize || image.thumbnail)) : (base + (image.thumbnail || ''));
        slide.thumbnail = image.thumbnail;
        slide.fullsize = image.fullsize;
        slide.alt = image.caption || image.name || `Image ${i + 1}`;'';
        slide.description = image.caption || '';
        slide.authorPhoto = author.photo ? base + author.photo : '';
        slide.authorSince = author.userSince || '';
        slide.authorChannel = author.channel || '';
        slide.topHeading = author.name || '';
        slide.liked = image.liked || false;
        slide.imageId = image.id;

        // Add thumbnail URL to thumbnails array
        this.thumbnails.push(base + image.thumbnail);
      }
    });
  }

  _readIndexFromURL() {
    // Read index from URL hash or query params if needed
    // For now, just ensure currentIndex is valid
    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    }
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('currentIndex')) {
      // Scroll the indicators to show the current image's thumbnail
      const indicators = this.shadowRoot?.querySelector('insta-indicators');
      if (indicators && typeof indicators.scrollToIndex === 'function') {
        indicators.scrollToIndex(this.currentIndex);
      }
    }
  }
}

globalThis.customElements.define(InstaApp.tag, InstaApp);