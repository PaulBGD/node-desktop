const ref = require('ref');
const ffi = require('ffi');

const GtkApplicationPointer = ref.refType(ref.types.void);
const GtkWidgetPointer = ref.refType(ref.types.void);
const FunctionPointer = ffi.Function(ref.types.void, []);

module.exports = gtk = ffi.Library('libgtk-3', {
    gtk_application_new: [GtkApplicationPointer, ['string', 'int']],
    g_signal_connect_data: [ref.types.void, [GtkApplicationPointer, ref.types.CString, FunctionPointer, 'pointer', 'pointer', 'int']],
    g_application_run: ['int', [GtkApplicationPointer, 'int', ref.types.CString]],
    g_object_unref: [ref.types.void, [GtkApplicationPointer]],

    // general widget stuff
    gtk_widget_show_all: [ref.types.void, [ref.refType(ref.types.void)]],
    gtk_widget_destroy: [ref.types.void, [GtkWidgetPointer]],
    gtk_widget_set_margin_left: [ref.types.void, [GtkWidgetPointer, 'int']],
    gtk_widget_set_margin_right: [ref.types.void, [GtkWidgetPointer, 'int']],
    gtk_widget_set_margin_top: [ref.types.void, [GtkWidgetPointer, 'int']],
    gtk_widget_set_margin_bottom: [ref.types.void, [GtkWidgetPointer, 'int']],
    gtk_widget_set_vexpand: ['void', [GtkWidgetPointer, 'bool']],
    gtk_widget_set_valign: ['void', [GtkWidgetPointer, 'int']],
    gtk_widget_set_hexpand: ['void', [GtkWidgetPointer, 'bool']],
    gtk_widget_set_halign: ['void', [GtkWidgetPointer, 'int']],
    gtk_container_add: [ref.types.void, [GtkWidgetPointer, GtkWidgetPointer]],

    // window defs
    gtk_application_window_new: [GtkWidgetPointer, [GtkApplicationPointer]],
    gtk_window_set_title: [ref.types.void, [GtkWidgetPointer, 'string']],
    gtk_window_set_default_size: [ref.types.void, [GtkWidgetPointer, 'int', 'int']],
    gtk_window_set_titlebar: [ref.types.void, [GtkWidgetPointer, GtkWidgetPointer]],
    gtk_window_set_interactive_debugging: [ref.types.void, ['bool']],

    // scrolled window
    gtk_scrolled_window_new: [GtkWidgetPointer, [ref.refType(ref.types.void), ref.refType(ref.types.void)]],
    gtk_scrolled_window_set_shadow_type: ['void', [GtkWidgetPointer, 'int']],

    // box
    gtk_box_new: [GtkWidgetPointer, ['int', 'int']],

    // list box
    gtk_list_box_new: [GtkWidgetPointer, []],
    gtk_list_box_insert: ['void', [GtkWidgetPointer, GtkWidgetPointer, 'int']],

    // header bar
    gtk_header_bar_new: [GtkWidgetPointer, []],
    gtk_header_bar_set_title: ['void', [GtkWidgetPointer, 'string']],
    gtk_header_bar_set_subtitle: ['void', [GtkWidgetPointer, 'string']],
    gtk_header_bar_set_show_close_button: ['void', [GtkWidgetPointer, 'bool']],
    gtk_header_bar_pack_end: ['void', [GtkWidgetPointer, GtkWidgetPointer]],

    // button box
    gtk_button_box_new: [GtkWidgetPointer, ['int']],

    // button
    gtk_button_new_with_label: [GtkWidgetPointer, ['string']],
    gtk_button_set_label: ['void', [GtkWidgetPointer, 'string']],

    // label
    gtk_label_new: [GtkWidgetPointer, ['string']],
    gtk_label_set_text: ['void', [GtkWidgetPointer, 'string']],
});
