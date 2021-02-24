public with sharing class NavMenuController {
    @AuraEnabled(Cacheable=true)
    public static List<NavigationMenuItem> getNavigationMenuItems(
        String menuName
    ) {
        List<NavigationMenuItem> navigationMenuItems = [
            SELECT
                Id,
                Label, // The label of the navigation item
                Type, // The type of navigation item - like we mentioned above
                Target, // The entity you are navigating to
                TargetPrefs, // If you are opening in the current or new tab if the type is external
                DefaultListViewId, // The default list view if the type is object
                AccessRestriction // The public/authenticated visability settings
            FROM NavigationMenuItem
            WHERE
                NavigationLinkSet.DeveloperName = :menuName // A reference to the parent Menu
                AND Status = 'Live' // Check that the item is Live and not in preview
            ORDER BY Position // Order by the positing specified in the editor
        ];
        return navigationMenuItems;
    }
}
