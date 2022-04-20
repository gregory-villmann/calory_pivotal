// Storage controller
const StorageCtrl = (function (){
    return{
        storeItem: function (item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        storeCurrentItem: function (item){
            localStorage.setItem('currentItem', item)
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemStorage: function (itemToDeleteID) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (itemToDeleteID === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        removeAllItems: function () {
            localStorage.removeItem("items");
        },
    }
})


// item controller

const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = iD.next().value;
        this.name = name;
        this.calories = calories;
    }

    function* genID() {
        let id = 1;
        while (true) {
            yield id++;
        }
    }
    const iD = genID();

    const data = {
        items: [],
        total: 0,
        currentItem: null,
    }
    return{
        getItems: function (){
            return data.items
        },
        addItem: function (name, calories){
            let ID;
            data.items.length > 0 ? ID = data.items[data.items.length -1].id + 1 : ID = 0;
            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem
        },
        getTotalCalories: function (){
            let total = 0;
            data.items.forEach(function(item){
                total = total + item.calories;
            });
            data.total = total;
            return data.total;
        },
        findItemFromId: function (ID){
            let items = data.items;
            for(let i=0; i<items.length; i++){
                if (items[i].id == ID){
                    return JSON.stringify(items[i]);
                }
            }
        },
        updateItemByID: function (id, name, calories) {
            let updatedItem = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    item.name = name;
                    item.calories = parseInt(calories);
                    updatedItem = item;
                }
            });
            return updatedItem;
        },
        itemToBeDeleted: function (id) {
            //Get ids;
            const ids = data.items.map((item) => {
                return item.id;
            });
            const index = ids.indexOf(id);

            //Remove itme
            data.items.splice(index, 1);
        },
    }
})();


// ui controller

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#itemName',
        itemCaloriesInput: '#itemCalories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        totalCalories: '.total-calories',
        editItemBtn: '.edit-item',
        cancelUpdateBtn: '.cancel-update-btn',
        deleteItemBtn: '.delete-btn',
    }
    return{
        populateItemList: function (items){
            let html = "";
            items.forEach(function (item){
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a></li>`;
            })
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function (){
            return UISelectors;
        },
        getItemInput: function (){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item){
            const li = document.createElement("li");
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>`;
            document.querySelector("#item-list").insertAdjacentElement('beforeend', li);
        },
        cleaInput: function (){
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = null;
        },
        showTotalCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clickEditMeal: function (){
            document.querySelector(UISelectors.cancelUpdateBtn).style= "display: inline";
            document.querySelector(UISelectors.updateBtn).style= "display: inline";
            document.querySelector(UISelectors.deleteItemBtn).style= "display: inline";
            document.querySelector(UISelectors.addBtn).style = "display: none";
        },
        cancelEditMeal: function (){
            document.querySelector(UISelectors.cancelUpdateBtn).style= "display: none";
            document.querySelector(UISelectors.updateBtn).style= "display: none";
            document.querySelector(UISelectors.deleteItemBtn).style= "display: none";
            document.querySelector(UISelectors.addBtn).style = "display: inline";
            this.cleaInput();
        },
        editItemToForm: function (item){
            document.querySelector(UISelectors.itemNameInput).value = item.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
        },
        removeLiItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        updateTotCalories: function (totalCal) {
            document.querySelector(UISelectors.totalCalories).innerHTML = totalCal;
        },
        updateListItem: function (item) {
            const listItems = document.querySelectorAll("#item-list li");
            const listItemsConvert = Array.from(listItems);
            listItemsConvert.forEach((li) => {
                const liID = li.getAttribute("id");
                if (liID === `item-${parseInt(item.id)}`) {
                    li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>`
                }
            });
        },

    }
})();

//app controller

const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    const loadEventListeners = function (){
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.addEventListener('DOMContentLoaded', getItemsFromStorage);
        document.querySelector(UISelectors.itemList).addEventListener('click', editItemBtn)
        document.querySelector(UISelectors.cancelUpdateBtn).addEventListener('click', cancelItemUpdate);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItem);
        document.querySelector(UISelectors.deleteItemBtn).addEventListener('click', deleteItemBtn);
    }
    const itemAddSubmit = function (event){
        const input = UICtrl.getItemInput();
        if(input.name !== ""  && input.calories !== ""){
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem);
            UICtrl.cleaInput();
        }
        event.preventDefault();
    }
    const editItemBtn = function (event){
        if(event.target.className === 'edit-item fas fa-edit'){
            let pressId = event.target.parentElement.parentElement.id.split('-')[1]; // logib item id
            let newCurrentItem = ItemCtrl.findItemFromId(pressId);
            StorageCtrl.storeCurrentItem(newCurrentItem);
            UICtrl.clickEditMeal();
            UICtrl.editItemToForm(JSON.parse(localStorage.getItem('currentItem')));
        }
    }
    const cancelItemUpdate = function (){
        UICtrl.cancelEditMeal()
    }

    const getItemsFromStorage = function (){
        const items = StorageCtrl.getItemsFromStorage();
        items.forEach(function (item){
            ItemCtrl.addItem(item['name'], item['calories'])
        })
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.populateItemList(items);
    }
    const updateItem = function (event){
        const input = UICtrl.getItemInput();
        let updatedName = document.querySelector('#itemName').value;
        let updatedCalories = document.querySelector('#itemCalories').value;
        let curr = JSON.parse(localStorage.getItem('currentItem'));
        let currentItemId = curr.id;
        if(input.name == curr.name  && input.calories == curr.calories){
            window.alert("You already have the same values!");
        } else if(input.name !== ""  && input.calories !== ""){
            const updatedItemSubmit = ItemCtrl.updateItemByID(currentItemId, input.name, input.calories);
            UICtrl.updateListItem(updatedItemSubmit);
            const totalCal = ItemCtrl.getTotalCalories();
            UICtrl.updateTotCalories(totalCal);
            UICtrl.cancelEditMeal();
            UICtrl.cleaInput();
            StorageCtrl.updateItemStorage(updatedItemSubmit);
        }
        event.preventDefault();
    }
    const deleteItemBtn = function(event){
        let currentItem = JSON.parse(localStorage.getItem('currentItem'));
        let toBeDeletedId = currentItem.id;

        ItemCtrl.itemToBeDeleted(toBeDeletedId);
        UICtrl.removeLiItem(toBeDeletedId);
        UICtrl.cancelEditMeal();
        UICtrl.cleaInput();
        const totalCal = ItemCtrl.getTotalCalories();
        UICtrl.updateTotCalories(totalCal);
        StorageCtrl.deleteItemStorage(toBeDeletedId);
        event.preventDefault();
    }
    return{
        init: function (){
            const items = ItemCtrl.getItems();
            UICtrl.populateItemList(items);
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl());

// Init. app
App.init();
// tegelt on kõik juba tehtud