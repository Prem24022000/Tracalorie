const ItemCtrl = (function(){
    
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    return{

        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id+1;
            }else{
                ID = 0;
            }

            calories = parseInt(calories);

            const newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id){
            let found = null;

            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id){
            ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getCalories: function(){
            let total = 0;

            data.items.forEach((item) => {
                total += item.calories;
            });

            data.totalCalories = total;

            return  data.totalCalories = total;
        },

        logData: function(){
            return data;
        }
    }
})();


const UICtrl = (function(){
    const UISelectors = {
        updateBtn: '.update-btn',
        listItems: '#item-list li',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateUI: function(items){
            let html = '';
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}
                            : </strong> <em>${item.calories}</em>
                            <a href="#" class="secondary-content">
                            <i class="fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,

                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}
            : </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).appendChild(li);
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}
                    : </strong> <em>${item.calories}</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },

        hideItem: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },


        clearEditState: function(){
            UICtrl.clearInput();

            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function(){

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        
        getSelectors: function(){
            return UISelectors;
        }
    }

})();

const App = (function(ItemCtrl, UICtrl){

    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        document.addEventListener('keypress', function(e){
            if(e.which === 13 || e.keyCode === 13){
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemClick);

        document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){

            UICtrl.clearEditState();

            e.preventDefault();
        });
    }

    

    const itemAddSubmit = function(e){
        
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getCalories();

            UICtrl.showCalories(totalCalories);

            UICtrl.clearInput();            
        }

        e.preventDefault();
    }

    

    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentElement.parentElement.id;

            const listArr = listId.split('-')[1];

            const id = parseInt(listArr);
            
            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = function(e){

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getCalories();

        UICtrl.showCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){

        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getCalories();

        UICtrl.showCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemClick = function(){
        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getCalories();

        UICtrl.showCalories(totalCalories);

        UICtrl.removeItems();

        UICtrl.hideItem();
    }

    return{
        init: function(){
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideItem();
            }else{
                UICtrl.populateUI(items);
            }
            const totalCalories = ItemCtrl.getCalories();
            UICtrl.showCalories(totalCalories);
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init();