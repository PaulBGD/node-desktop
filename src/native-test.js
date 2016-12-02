const nbind = require('nbind');
const binding = nbind.init();
const instance = binding.lib.Gtk.application_new('net.burngames', binding.lib.ApplicationFlags.FLAGS_NONE());
console.log(instance);