sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.USERS", {
        onInit: function () {
            this.oSelectedItem = null;
            this.oOriginalData = null;
        },

        onSelectionChange: function (oEvent) {
            this.oSelectedItem = oEvent.getParameter("listItem");
            this.getView().byId("editButton").setEnabled(true);
        },

        onEditPress: function () {
            if (this.oSelectedItem) {
                var aCells = this.oSelectedItem.getCells();
                this.oOriginalData = {};  // Store original data for cancel action

                aCells.forEach(function (oCell, index) {
                    var sText = oCell.getText();
                    this.oOriginalData[index] = sText;  // Store original data

                    var oInput = new sap.m.Input({
                        value: sText
                    });
                    oCell.getParent().addCell(oInput);
                    oCell.getParent().removeCell(oCell);
                }.bind(this));

                this._toggleButtons(true);
            }
        },

        onSavePress: function () {
            if (this.oSelectedItem) {
                var aCells = this.oSelectedItem.getCells();
                var oModel = this.getView().getModel();
                var sPath = this.oSelectedItem.getBindingContext().getPath();
                var oData = {};

                // Collect the data from the input fields
                aCells.forEach(function (oCell, index) {
                    var sValue = oCell.getValue();
                    var sProperty = this._getPropertyByIndex(index);
                    oData[sProperty] = this._formatValue(sProperty, sValue);
                }.bind(this));

                // Log the data being sent for debugging purposes
                console.log("Updating data:", oData);

                // Validate the data
                if (this._validateData(oData)) {
                    // Update the backend with the new data
                    oModel.update(sPath, oData, {
                        success: function () {
                            MessageToast.show("Update successful");
                        },
                        error: function (oError) {
                            console.error("Update failed", oError);
                            MessageToast.show("Update failed");
                        }
                    });

                    // Replace input fields with text fields
                    aCells.forEach(function (oCell, index) {
                        var sValue = oCell.getValue();
                        var oText = new sap.m.Text({
                            text: sValue
                        });
                        oCell.getParent().addCell(oText);
                        oCell.getParent().removeCell(oCell);
                    });

                    this._toggleButtons(false);
                } else {
                    MessageToast.show("Validation failed. Please check your inputs.");
                }
            }
        },

        onCancelPress: function () {
            if (this.oSelectedItem) {
                var aCells = this.oSelectedItem.getCells();

                aCells.forEach(function (oCell, index) {
                    var sText = this.oOriginalData[index];

                    var oText = new sap.m.Text({
                        text: sText
                    });
                    oCell.getParent().addCell(oText);
                    oCell.getParent().removeCell(oCell);
                }.bind(this));

                this._toggleButtons(false);
            }
        },

        onInsertPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteInsert");
        },


        _toggleButtons: function (bEdit) {
            this.getView().byId("editButton").setVisible(!bEdit);
            this.getView().byId("saveButton").setVisible(bEdit);
            this.getView().byId("cancelButton").setVisible(bEdit);
        },

        _getPropertyByIndex: function (index) {
            var aProperties = ["Codice", "Nome", "Cognome", "DatNascita", "Sesso", "Corso", "Voto", "Lode"];
            return aProperties[index];
        },

        _validateData: function (oData) {
            // Implement validation logic here
            // For example, check if 'Voto' is a number
            if (isNaN(oData.Voto)) {
                console.error("Invalid value for 'Voto':", oData.Voto);
                return false;
            }
            // Add other validation checks as needed
            return true;
        },

        _formatValue: function (sProperty, sValue) {
            // Implement formatting logic here based on property type
            if (sProperty === "Voto") {
                return parseFloat(sValue); // Ensure 'Voto' is a number
            }
            // Add other formatting rules as needed
            return sValue;
        }
    });
});
