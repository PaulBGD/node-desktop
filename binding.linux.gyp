{
	"targets": [
		{
			"target_name": "node-desktop",
			"sources": [
				"native/loop.cc"
			],
			"cflags": [
				"<!@(pkg-config --cflags gobject-introspection-1.0 gtk+-3.0) -Wall -Werror"
			],
			"ldflags": [
				"-Wl,-no-as-needed",
				"<!@(pkg-config --libs gobject-introspection-1.0 gtk+-3.0)"
			],
			"conditions": [
				["OS == \"mac\"", {
					"xcode_settings": {
						"OTHER_CFLAGS": [
							"<!@(pkg-config --cflags glib-2.0 gobject-introspection-1.0)"
						],
						"OTHER_LDFLAGS": [
							"<!@(pkg-config --libs gobject-introspection-1.0)"
						]
					}
				}]
			]
		}
	]
}
