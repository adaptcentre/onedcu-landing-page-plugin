# Discourse Landing Page Plugin
Imagine NUI Galway Landing Page

---

API keys and category id's can now be changed in the admin interface of the main discourse application (plugin/settings). They can also be changed in /config/settings.yml. Default options are hardcoded, but and are typically unique to each discourse instance.

---

Discourse github repo: https://github.com/discourse/discourse

Development process:
 - follow these steps to create a local dev environment
   - mac: https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-macos-for-development/15772
   - Ubuntu: https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-ubuntu-for-development/14727
   - windows: https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-windows-10-for-development/75149
 - download this plugin either to the /plugin folder of the discource clone or create a symlink
 	 - simlink: https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-4-git-setup/31272


Commands:
 - rm -rf tmp; bundle exec rails s -> run dev version


Misc:
 - using images that are saved in plugin public folder: https://meta.discourse.org/t/is-it-possible-to-include-background-images-with-a-plugin/36298/3
 - plugin settings page api: https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-3-custom-settings/31115
 - install plugin on production server: https://meta.discourse.org/t/install-plugins-in-discourse/19157
 - sending builk email invites: https://meta.discourse.org/t/sending-bulk-user-invites/16468


 Notes:
 	- The API keys are currently hardcoded. Site settings have been added but they are not linked in the code yet.
 	- API KEY SECURITY issue -> create new group and generate API keys?
