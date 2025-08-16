/// <reference types="google.maps" />

interface Window {
  initMap?: () => void;
  google?: typeof google;
}
