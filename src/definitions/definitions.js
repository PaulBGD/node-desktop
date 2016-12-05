// hook uv into gtk
const native = require('bindings')('node-desktop');
native.StartLoop();

const ref = require('ref');
const ffi = require('ffi');
const StructType = require('ref-struct');

const GtkApplicationPointer = ref.refType(ref.types.void);
const GtkWidgetPointer = ref.refType(ref.types.void);
const GtkEntryBufferPointer = ref.refType(ref.types.void);
const FunctionPointer = ffi.Function(ref.types.void, []);

module.exports = gtk = ffi.Library('libgtk-3', {
    gtk_main: ['void', []],
    gtk_events_pending: ['bool', []],
    gtk_main_iteration: ['void', []],
    gtk_main_iteration_do: ['void', ['bool']],

    gtk_application_new: [GtkApplicationPointer, ['string', 'int']],
    g_signal_connect_data: [ref.types.void, [GtkApplicationPointer, ref.types.CString, FunctionPointer, 'pointer', 'pointer', 'int']],
    g_application_run: ['int', [GtkApplicationPointer, 'int', ref.refType(ref.types.void)]],
    g_object_unref: [ref.types.void, [GtkApplicationPointer]],

    // screen stuff
    gdk_screen_get_default: [ref.refType(ref.types.void), []],

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
    gtk_widget_get_style_context: [ref.refType(ref.types.void), [GtkWidgetPointer]],

    // container
    gtk_container_add: [ref.types.void, [GtkWidgetPointer, GtkWidgetPointer]],
    gtk_container_remove: [ref.types.void, [GtkWidgetPointer, GtkWidgetPointer]],

    // style context
    gtk_style_context_add_class: ['void', [ref.refType(ref.types.void), 'string']],
    gtk_style_context_remove_class: ['void', [ref.refType(ref.types.void), 'string']],
    gtk_style_context_add_provider_for_screen: ['void', [ref.refType(ref.types.void), ref.refType(ref.types.void), 'int']],

    // css provider
    gtk_css_provider_new: [ref.refType(ref.types.void), []],
    gtk_css_provider_load_from_data: ['bool', [ref.refType(ref.types.void), 'string', 'int', ref.refType(ref.types.void)]],

    // window defs
    gtk_application_window_new: [GtkWidgetPointer, [GtkApplicationPointer]],
    gtk_window_set_title: [ref.types.void, [GtkWidgetPointer, 'string']],
    gtk_window_set_default_size: [ref.types.void, [GtkWidgetPointer, 'int', 'int']],
    gtk_window_set_titlebar: [ref.types.void, [GtkWidgetPointer, GtkWidgetPointer]],
    gtk_window_set_interactive_debugging: [ref.types.void, ['bool']],
    gtk_window_set_position: ['void', [GtkWidgetPointer, 'int']],

    // scrolled window
    gtk_scrolled_window_new: [GtkWidgetPointer, [ref.refType(ref.types.void), ref.refType(ref.types.void)]],
    gtk_scrolled_window_set_shadow_type: ['void', [GtkWidgetPointer, 'int']],

    // box
    gtk_box_new: [GtkWidgetPointer, ['int', 'int']],
    gtk_box_reorder_child: ['void', [GtkWidgetPointer, GtkWidgetPointer, 'int']],
    gtk_box_set_spacing: ['void', [GtkWidgetPointer, 'int']],

    // list box
    gtk_list_box_new: [GtkWidgetPointer, []],
    gtk_list_box_insert: ['void', [GtkWidgetPointer, GtkWidgetPointer, 'int']],

    // header bar
    gtk_header_bar_new: [GtkWidgetPointer, []],
    gtk_header_bar_set_title: ['void', [GtkWidgetPointer, 'string']],
    gtk_header_bar_set_subtitle: ['void', [GtkWidgetPointer, 'string']],
    gtk_header_bar_set_show_close_button: ['void', [GtkWidgetPointer, 'bool']],
    gtk_header_bar_pack_end: ['void', [GtkWidgetPointer, GtkWidgetPointer]],
    gtk_header_bar_pack_start: ['void', [GtkWidgetPointer, GtkWidgetPointer]],
    gtk_header_bar_set_custom_title: ['void', [GtkWidgetPointer, GtkWidgetPointer]],

    // button box
    gtk_button_box_new: [GtkWidgetPointer, ['int']],

    // button
    gtk_button_new_with_label: [GtkWidgetPointer, ['string']],
    gtk_button_set_label: ['void', [GtkWidgetPointer, 'string']],

    // label
    gtk_label_new: [GtkWidgetPointer, ['string']],
    gtk_label_set_text: ['void', [GtkWidgetPointer, 'string']],

    // entry
    gtk_entry_new: [GtkWidgetPointer, []],
    gtk_entry_set_text: ['void', [GtkWidgetPointer, 'string']],
    gtk_entry_get_text: ['string', [GtkWidgetPointer]],
    gtk_entry_set_width_chars: ['void', [GtkWidgetPointer, 'int']],
    gtk_entry_set_progress_fraction: ['void', [GtkWidgetPointer, 'double']],

    // entry buffer
    gtk_entry_buffer_new: [GtkEntryBufferPointer, ['string', 'int']],
    gtk_entry_buffer_get_text: ['string', [GtkEntryBufferPointer]],
    gtk_entry_buffer_set_text: ['void', [GtkEntryBufferPointer, 'string', 'int']],
});

module.exports.StyleProvider = {
    FALLBACK: 1,
    THEME: 200,
    SETTINGS: 400,
    APPLICATION: 600,
    USER: 800
};

module.exports.GError = StructType({
    domain: ref.types.uint32,
    code: ref.types.long,
    message: ref.types.CString
});

module.exports.listen = function (widget, event, callback) {
    function eventCallback() {
        try {
            callback();
        } catch (err) {
            console.error(err);
        }
    }
    const cb = ffi.Callback('void', [], eventCallback);
    gtk.g_signal_connect_data(widget.getHandle(), event, cb, null, null, 0);
    return cb;
};
