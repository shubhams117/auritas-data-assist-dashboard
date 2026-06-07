sap.ui.define([], function () {
    "use strict";

    return {

        statusState: function (sStatus) {

            switch (sStatus) {

            case "failed":
                return "Error";

            case "blocked":
                return "Warning";

            case "completed":
                return "Success";

            case "running":
                return "Information";

            default:
                return "None";
            }
        }

    };

});