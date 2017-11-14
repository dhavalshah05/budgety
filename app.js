/**
 * BUDGET CONTROLLER
 */
var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }

    return {
        addNewItem: function (type, desc, value) {
            var newItem, id;

            // generate id
            if (data.items[type].length > 0) {
                id = data.items[type][data.items[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // create new item
            if (type === 'inc') {
                newItem = new Income(id, desc, value);
            } else if (type == 'exp') {
                newItem = new Expense(id, desc, value);
            }

            // add new item to data structure
            data.items[type].push(newItem);

            return newItem;
        },
        testing: function () {
            return data;
        }
    }
})();


/**
 * UI CONTROLLER
 */
var UIController = (function () {

    var DOMString = {
        inputButton: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML string with placeholders
            if (type === 'inc') {
                element = DOMString.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = DOMString.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace placeholders with an actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // add HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getInputButton: function () {
            return document.querySelector(DOMString.inputButton);
        },

        getInputData: function () {
            return {
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            }
        },

        clearFields: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMString.inputDescription + ', ' + DOMString.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (element, index, array) {
                element.value = '';
            });

            fieldsArray[0].focus();
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
        // get the field input data
        var inputData = UICtrl.getInputData();

        if (inputData.description.trim().length === 0 || isNaN(inputData.value) || inputData.value <= 0)
            return;

        // add the item to the budget controller
        var newItem = budgetCtrl.addNewItem(inputData.type, inputData.description, inputData.value);

        // add the item to the UI
        UICtrl.addListItem(newItem, inputData.type);

        // clear the fields
        UICtrl.clearFields();
    };

    return {
        init: function () {
            console.log('Application has started');
            setUpEventListener();
        }
    }

})(budgetController, UIController);


controller.init();