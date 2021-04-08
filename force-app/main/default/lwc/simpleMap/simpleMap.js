import { LightningElement, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import mapbox from '@salesforce/resourceUrl/mapbox'

export default class SimpleMap extends LightningElement {
    _accessToken;

    @api get accessToken() {
        return this._accessToken;
    }

    set accessToken(accessToken) {
        this._accessToken = accessToken;

        Promise.all([
            loadStyle(this, mapbox + '/mapbox.css'),
            loadScript(this, mapbox + '/mapbox.js')
        ]).then(() => {
            L.mapbox.accessToken = this._accessToken;
            var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
                attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                tileSize: 512,
                zoomOffset: -1
            });

            const map = L.map(this.template.querySelector(".map"))
                .addLayer(mapboxTiles)
                .setView([42.3610, -71.0587], 15);

        })
    }
}
