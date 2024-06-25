sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.Insert", {
        onInit: function () {
            // Initialization code if needed
        },
        onInsertSavePress: function () {
            var oModel = this.getView().getModel();
            var oData = {
                Codice: this.getView().byId("newCodice").getValue(),
                Nome: this.getView().byId("newNome").getValue(),
                Cognome: this.getView().byId("newCognome").getValue(),
                DatNascita: this.getView().byId("newDatNascita").getValue(),
                Sesso: this.getView().byId("newSesso").getValue(),
                Corso: this.getView().byId("newCorso").getValue(),
                Voto: parseInt(this.getView().byId("newVoto").getValue()), // Ensure to parse as integer or byte as per your data type
                Lode: this.getView().byId("newLode").getSelected() ? 'Y' : 'N' // Assuming Lode is a string ('Y' or 'N')
            };
        
            if (this._validateData(oData)) {
                oModel.create("/Zet_test_Set", oData, {
                    success: function () {
                        sap.m.MessageToast.show("Insert successful");
                        this.onNavBack(); // Navigate back after successful insert
                    }.bind(this),
                    error: function (oError) {
                        console.error("Insert failed", oError);
                        sap.m.MessageToast.show("Insert failed: " + oError.message);
                    }
                });
            } else {
                sap.m.MessageToast.show("Validation failed. Please check your inputs.");
            }
        },
        
        _validateData: function (oData) {
            if (isNaN(oData.Voto)) {
                console.error("Invalid value for 'Voto':", oData.Voto);
                return false;
            }
            return true;
        },
        
        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteUSERS"); 
        }
    });
});
