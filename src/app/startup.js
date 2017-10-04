define(['knockout', './router'], function(ko, router) {
    // Components can be packaged as AMD modules, such as the following:

    ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
    ko.components.register('home-page', { require: 'components/home-page/home' });
    ko.components.register('api-test', { require: 'components/api-test/apitest' });
    ko.components.register('accession-page', { require: 'components/accession-page/accession' }); 
    ko.components.register('marker-page', { require: 'components/marker-page/marker' }); 
    ko.components.register('variant-page', { require: 'components/variant-page/variant' }); 
    ko.components.register('23andMe-OAuth', { require: 'components/23andMe-OAuth/login' });
    ko.components.register('logout', { require: 'components/logout/logout' });
    // ... or for template-only components, you can just point to a .html file directly:
    ko.components.register('about-page', {
        template: { require: 'text!components/about-page/about.html' }
    });

    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

    // Start the application
    ko.applyBindings({ route: router.currentRoute });
});
