import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { onScroll } from './scroll.js';
import { createMarkup } from './markup.js';
import { servisePixabay } from './servisePixabay.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more-hidden');
let page = 1;
let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', fetchPhotos);
btnLoadMore.addEventListener('click', onLoadMore);

async function fetchPhotos(e) {
  try {
    e.preventDefault();
    gallery.innerHTML = '';
    document.body.classList.remove('gradient');
    btnLoadMore.classList.replace('load-more', 'load-more-hidden');

    page = 1;
    const arrPhotos = await servisePixabay(page);
    createMarkup(arrPhotos.hits);

    document.body.classList.add('gradient');
    Notify.success(`Hooray! We found ${arrPhotos.totalHits} images.`);
    lightbox.refresh();
  } catch (err) {
    console.log('TRY-CATCH:', err);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    gallery.innerHTML = '';
    document.body.classList.remove('gradient');
    btnLoadMore.classList.replace('load-more', 'load-more-hidden');
  }
}

async function onLoadMore() {
  page += 1;

  const arrPhotos = await servisePixabay(page);
  createMarkup(arrPhotos.hits);
  onScroll();
  lightbox.refresh();
  // console.log(page * arrPhotos.hits.length);
  if (
    page * arrPhotos.hits.length >= arrPhotos.totalHits ||
    page * arrPhotos.hits.length === 0
  ) {
    btnLoadMore.classList.replace('load-more', 'load-more-hidden');
    Notify.info("We`re sorry, but you've reached the end of search results.");
  }
}

export { gallery, btnLoadMore, form };
