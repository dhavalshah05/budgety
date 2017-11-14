/**
 * BUDGET CONTROLLER
 */
var budgetController = (function () {

})();


/**
 * UI CONTROLLER
 */
var UIController = (function () {

    var DOMString = {
        inputButton: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    };

    return {
        getInputButton: function () {
            return document.querySelector(DOMString.inputButton);
        },
        getInputData: function () {
            return {
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: document.querySelector(DOMString.inputValue).value
            }
        }
    }
})();

/**
 * GLOBAL APP CONTROLLER
 */
var controller = (function (budgetCtrl, UICtrl) {

    var setUpEventListener = function () {
        // setup add button click event
        UICtrl.getInputButton().addEventListener('click', function () {
            ctrlAddItem();
        });

        // setup ENTER key pressed event
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        var inputData = UICtrl.getInputData();
        console.log(inputData);
    };

    return {
        init: function() {
            console.log('Application has started');
            setUpEventListener();
        }
    }

})(budgetController, UIController);


controller.init();