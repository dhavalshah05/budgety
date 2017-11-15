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
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: 0
    }

    var calculateTotal = function (type) {
        var sum = 0;

        data.items[type].forEach(function (obj) {
            sum += obj.value;
        });

        return sum;
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

        calculateBudget: function () {
            // calculate total income and expense
            data.totals['inc'] = calculateTotal('inc');
            data.totals['exp'] = calculateTotal('exp');

            // calculate budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {
            data.items.exp.forEach(function (obj) {
                obj.calcPercentage(data.totals.inc);
            });
        },

        deleteItem: function (type, id) {
            var itemIndex = -1;
            data.items[type].forEach(function (item, index) {
                if (item.id === id) {
                    itemIndex = index;
                }
            });

            if (itemIndex !== -1) {
                data.items[type].splice(itemIndex, 1);
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        getPercentages: function () {
            var percentages = data.items.exp.map(function (obj) {
                return obj.percentage;
            });

            return percentages;
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage'
    };

    return {
        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML string with placeholders
            if (type === 'inc') {
                element = DOMString.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = DOMString.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
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

        getContainer: function () {
            return document.querySelector(DOMString.container);
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
        },

        displayBudget: function (obj) {
            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMString.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMString.percentageLabel).textContent = 'N/A';
            }
        },

        updatePercentages: function (percentages) {
            var nodeList = document.querySelectorAll(DOMString.expPercentageLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(nodeList, function (element, index) {
                if (percentages[index] > 0) {
                    element.textContent = percentages[index] + '%';
                } else {
                    element.textContent = 'N/A';
                }
            });
        },

        deleteListItem: function (type, id) {
            var selectorId = type + '-' + id;
            var elementToDelete = document.getElementById(selectorId);

            elementToDelete.parentNode.removeChild(elementToDelete);
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

        // setup delete button event
        UICtrl.getContainer().addEventListener('click', function (event) {
            var itemId = '';

            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if (itemId && (itemId.includes('inc') || itemId.includes('exp'))) {
                var splitItemId = '',
                    id, type;
                splitItemId = itemId.split('-');
                type = splitItemId[0];
                id = parseInt(splitItemId[1]);

                ctrlDeleteItem(type, id);
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

        updateBudget();

        updatePercentage();
    };

    var ctrlDeleteItem = function (type, id) {
        budgetCtrl.deleteItem(type, id);

        UICtrl.deleteListItem(type, id);

        updateBudget();

        updatePercentage();
    }

    var updateBudget = function () {
        // calculate budget
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        // display budget
        UICtrl.displayBudget(budget);
    }

    var updatePercentage = function () {
        // calculate percentages
        budgetCtrl.calculatePercentages();

        // get percentages
        var percentages = budgetCtrl.getPercentages();

        // update UI
        UICtrl.updatePercentages(percentages);
    }

    return {
        init: function () {
            console.log('Application has started');
            setUpEventListener();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
        }
    }

})(budgetController, UIController);


controller.init();