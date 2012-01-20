Chrome Extension Development, By Example
========================================

Why Create a Chrome Extension?
------------------------------

* It's a great way to integrate seamlessly with a third-party site like Gmail.
** It in turn solves the "other site" problem.
* The Chrome Web Store is a wonderful source of traffic.
* All your friends are doing it.

Challenges
----------

* A somewhat difficult paradigm to work with.
* Hooking into the DOM of a 3rd party website is fragile.

Surmounting these Challenges
----------------------------

* Learning to work within the paradigm.
* Writing clean, well designed, JavaScript.
* Listening to this presentation.

The Example, ImageMaily
-----------------------

An extension that lets you email an arbitrary image to an equally arbitrary email address. Demonstrates several core concepts related to Chrome extension development.

Background Pages
----------------

* One background page runs for your extension.
* Is the only place where XHR requests to the server can originate from.

Context Menus
-------------
* Let you add alternative right click options.

Content Scripts
---------------

* Allow you to interact with the current page in a tab.
* Cannot make requests to the server.

A Sane Paradigm
---------------

* Message queues are a great way of approaching the problem.
** Content Scripts pass messages to the background page.
** The background script makes requests to the server and returns messages to content scripts.
