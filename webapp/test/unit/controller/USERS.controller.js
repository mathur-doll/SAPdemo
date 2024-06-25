/*global QUnit*/

sap.ui.define([
	"project1/controller/USERS.controller"
], function (Controller) {
	"use strict";

	QUnit.module("USERS Controller");

	QUnit.test("I should test the USERS controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
