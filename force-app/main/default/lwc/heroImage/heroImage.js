import { LightningElement, api } from 'lwc';
import communityBasePath from '@salesforce/community/basePath';
import HERO_IMAGE from "@salesforce/contentAssetUrl/sodanobrand";

/**
 * @slot default
 */
export default class HeroImage extends LightningElement {
    @api headline;
    @api hideHome;

    get backgroundImage() {
        const s = `background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${HERO_IMAGE}");`
        return s;
    }

    home() {
        document.location.href = `${communityBasePath}/`;
    }
}