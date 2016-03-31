Package.describe({
  name:"qinghai:lazyload",
  version:"0.0.1",
  summary: "lazyload",
  git:  "https://github.com/qing-hai/Meteor-LazyLoad/tree/0.0.1.5"        
});

Package.on_use(function (api) {
    api.add_files('lazyload.client.js', 'client');
    api.add_files('lazyload.server.js', 'server');
    api.add_files('lazyload.common.js', ['client', 'server']);
    api.export("LazyLoad");
});

Package.on_test(function (api) {
  api.use('tinytest');
  api.use('deps');
  api.add_files('rigtest.js', 'server');
  api.add_files('lazyload.client.js', 'server');
  api.add_files('lazyload.tests.js', 'server');
});