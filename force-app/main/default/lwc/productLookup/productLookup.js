import { LightningElement } from 'lwc';
import communityBasePath from '@salesforce/community/basePath';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import lookup from '@salesforce/apex/ProductLookupController.lookup';

export default class ProductLookup extends LightningElement {
    scannerAvailable = false;
    myScanner;

    connectedCallback() {
        this.myScanner = getBarcodeScanner();
        this.scannerAvailable = this.myScanner.isAvailable();
    }

    showErrorToast(msg) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: msg,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    handleKeypress(event) {
        if (event.keyCode === 13) {
            this.handleSearch();
        }
    }

    handleSearch() {
        const value = this.template.querySelector(`lightning-input`).value;
        this.handleBarcode(value);
    }

    handleClear() {
        this.template.querySelector(`lightning-input`).value = "";
    }

    handleBarcode(value) {
        if (!value || !value.length) {
            this.handleClear();
        } else {
            lookup({ "productId": value }).then(records => {
                console.log(records);
                if (!records || !records.length) throw Error('No product found');
                document.location.href = `${communityBasePath}/detail/${records[0].Id}`;
            }).catch(err => {
                this.handleClear();
                this.showErrorToast(`Error looking up product with ID <${value}> due to error: ${err.message}`);
            })
        }
    }

    handleBeginScanClick() {
        const scanningOptions = {
            barcodeTypes: [
                this.myScanner.barcodeTypes.EAN_13,
                this.myScanner.barcodeTypes.QR,
                this.myScanner.barcodeTypes.DATA_MATRIX
            ]
        }
        this.myScanner.beginCapture(scanningOptions)
            .then((result) => {
                // Do something with the result of the scan
                const scannedBarcode = decodeURIComponent(result.value);
                this.template.querySelector(`lightning-input`).value = scannedBarcode;
                this.handleBarcode(scannedBarcode);
            })
            .catch((err) => {
                // Handle cancelation and scanning errors here
                this.showErrorToast(`Error scanning bar code / QR code due to error: ${err.message}`);
            })
            .finally(() => {
                this.myScanner.endCapture();
            });
    }
}