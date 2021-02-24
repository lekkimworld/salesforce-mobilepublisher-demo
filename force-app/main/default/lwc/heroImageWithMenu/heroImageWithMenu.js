import { LightningElement, api } from 'lwc';
import communityId from '@salesforce/community/Id';
import communityBasePath from '@salesforce/community/basePath';
import getNavItems from '@salesforce/apex/NavMenuController.getNavigationMenuItems';
import { NavigationMixin } from "lightning/navigation";

/**
 * @slot default
 */
export default class HeroImage extends NavigationMixin(LightningElement) {
    @api headline;
    menuItems;

    openNav() {
        this.template.querySelector(".sidenav").style.width = "250px";
    }

    closeNav() {
        this.template.querySelector(".sidenav").style.width = "0px";
    }

    handleMenuClick(event) {
        // Get the menu item's label from the target
        const selectedLabel = event.currentTarget.dataset.label;

        // Filter the menu items for the selected item
        let item = this.menuItems.filter(
            menuItem => menuItem.label === selectedLabel
        )[0];
        console.log("Detected click on item", item);

        // close menu
        this.closeNav();

        // Distribute the action to the relevant mechanisim for navigation
        if (item.urlType === "ExternalLink") {
            this.navigateToExternalPage(item);
        } else if (item.urlType === "InternalLink") {
            this.navigateToInternalPage(item);
        } else if (item.urlType === "SalesforceObject") {
            this.navigateToSalesforceObject(item);
        }
    }

    @api get menuName() {
        return this.menuNameValue;
    }

    set menuName(value) {
        this.menuNameValue = value.replace(/ /g, "_");
        console.log(`Menu name: ${this.menuNameValue} (${value}), community: ${communityId}`);
        if (!value) return;
        getNavItems({
            "menuName": this.menuNameValue
        }).then(data => {
            console.log("Loaded menu items", data);
            this.menuItems = data.map((item,) => {
                let obj = {}
                obj.id = item.Id;
                obj.label = item.Label;
                obj.targetPrefs = item.TargetPrefs;
                obj.accessRestriction = item.AccessRestriction;
                obj.url = item.Target;
                obj.urlType = item.Type;
                obj.listViewId = item.DefaultListViewId;
                return obj;
            });
            console.log("Menu items", this.menuItems);
        }).catch(err => {
            console.log("Error", err);
            this.error = err;
        })
    }

    navigateToSalesforceObject(item) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: item.url,
                actionName: 'list'
            },
            state: {
                filterName: item.listViewId
            }
        });
    }

    navigateToExternalPage(item) {
        const url = item.url;
        if (item.targetPrefs === "OpenExternalLinkInSameTab") {
            window.open(url, "_self");
        } else if (item.targetPrefs === "NewWindow") {
            this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                    url: url
                }
            });
        }
    }

    navigateToInternalPage(item) {
        const pageName = `${communityBasePath}${item.url}`;
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: pageName
            }
        });
    }
}