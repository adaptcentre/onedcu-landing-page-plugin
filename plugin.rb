# name: OneDCU-Landing-Page-Plugin
# about: Plugin that injects a custom landing page into a discourse instance
# version: 0.0.1
# authors: Ivan Bacher ivanbacher@adaptcentre.ie


enabled_site_setting :onedcu_enabled


register_asset "javascripts/third-party/async-2.6.2.min.js"
register_asset "javascripts/third-party/moment-2.24.0.min.js"
register_asset "javascripts/third-party/countdown-2.6.0.min.js"
register_asset "javascripts/third-party/moment-countdown.min.js"
register_asset "stylesheets/gridlex.min.css"
register_asset "stylesheets/animate.css"
register_asset "stylesheets/landing-page.scss"


register_svg_icon "chevron-down" if respond_to?(:register_svg_icon)
register_svg_icon "arrow-circle-right" if respond_to?(:register_svg_icon)
register_svg_icon "spinner" if respond_to?(:register_svg_icon)
